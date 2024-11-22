import { Antenna } from './types'
import { AntennaGroup } from './antennaData'

export function generateAntennaMapSVG(
  data: Antenna[], 
  onAntennaClick: (antenna: Antenna) => void, 
  selectedGroups: Set<string>,
  antennaGroups: AntennaGroup[]
) {
  const width = 1000
  const height = 600
  const legendWidth = 150
  const margin = { top: 40, right: 40, bottom: 40, left: 40 }
  const mapWidth = width - margin.left - margin.right - legendWidth
  const mapHeight = height - margin.top - margin.bottom

  const latitudes = data.map(a => a.position.latitude)
  const longitudes = data.map(a => a.position.longitude)
  const minLat = Math.min(...latitudes)
  const maxLat = Math.max(...latitudes)
  const minLon = Math.min(...longitudes)
  const maxLon = Math.max(...longitudes)

  const projectPoint = (lon: number, lat: number) => {
    const x = ((lon - minLon) / (maxLon - minLon)) * mapWidth
    const y = mapHeight - ((lat - minLat) / (maxLat - minLat)) * mapHeight
    return [x, y]
  }

  let svgContent = `
    <svg width="100%" height="100%" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        ${antennaGroups.map(group => `
          <radialGradient id="${group.id}Gradient">
            <stop offset="0%" stop-color="${group.color}" />
            <stop offset="100%" stop-color="${group.color}" stop-opacity="0.5" />
          </radialGradient>
        `).join('')}
        <style>
          @keyframes blink {
            0% { opacity: 1; }
            50% { opacity: 0.5; }
            100% { opacity: 1; }
          }
          .masked-antenna {
            animation: blink 1s linear infinite;
          }
          .legend-container {
            height: ${mapHeight}px;
            overflow-y: auto;
            overflow-x: hidden;
            background-color: white;
          }
          .legend-container::-webkit-scrollbar {
            width: 6px;
          }
          .legend-container::-webkit-scrollbar-track {
            background: #f1f1f1;
          }
          .legend-container::-webkit-scrollbar-thumb {
            background-color: #888;
            border-radius: 3px;
          }
          text {
            font-family: ui-sans-serif, system-ui, sans-serif;
          }
        </style>
      </defs>
      <rect width="${width}" height="${height}" fill="white"/>
      <g transform="translate(${legendWidth + margin.left}, ${margin.top})">
        <rect x="0" y="0" width="${mapWidth}" height="${mapHeight}" fill="#f1f1f1" rx="8" />
  `

  // Function to calculate the center point of a group of antennas
  const calculateCenter = (antennas: Antenna[]) => {
    const sum = antennas.reduce((acc, antenna) => {
      const [x, y] = projectPoint(antenna.position.longitude, antenna.position.latitude)
      return [acc[0] + x, acc[1] + y]
    }, [0, 0])
    return [sum[0] / antennas.length, sum[1] / antennas.length]
  }

  // Plot antennas grouped by the first four characters of their ID
  antennaGroups.forEach((group) => {
    if (!selectedGroups.has(group.id)) return;

    const [centerX, centerY] = calculateCenter(group.antennas)
    svgContent += `<g class="antenna-group" data-group="${group.id}">`

    // Draw smooth connections between outward antennas
    const sortedAntennas = [...group.antennas].sort((a, b) => {
      const [ax, ay] = projectPoint(a.position.longitude, a.position.latitude)
      const [bx, by] = projectPoint(b.position.longitude, b.position.latitude)
      return Math.atan2(ay - centerY, ax - centerX) - Math.atan2(by - centerY, bx - centerX)
    })

    let pathData = "M"
    sortedAntennas.forEach((antenna, index) => {
      const [x, y] = projectPoint(antenna.position.longitude, antenna.position.latitude)
      if (index === 0) {
        pathData += `${x},${y}`
      } else {
        pathData += ` L${x},${y}`
      }
    })
    pathData += "Z"

    svgContent += `
      <path 
        d="${pathData}" 
        fill="none" 
        stroke="${group.color}" 
        stroke-width="1.5" 
        opacity="0.6"
        stroke-linejoin="round"
      />
    `

    // Plot antenna points
    group.antennas.forEach((antenna) => {
      const [x, y] = projectPoint(antenna.position.longitude, antenna.position.latitude)
      const fillColor = antenna.masked ? 'purple' : `url(#${group.id}Gradient)`
      const className = antenna.masked ? 'masked-antenna' : ''
      const radius = antenna.masked ? 6 : 4
      svgContent += `
        <circle 
          cx="${x}" 
          cy="${y}" 
          r="${radius}" 
          fill="${fillColor}"
          stroke="${antenna.masked ? 'purple' : group.color}"
          stroke-width="1"
          class="cursor-pointer hover:opacity-80 transition-opacity ${className}"
          onclick="window.handleAntennaClick(${JSON.stringify(antenna).replace(/"/g, '&quot;')})"
        />
        <text 
          x="${x + 6}" 
          y="${y}" 
          font-size="8" 
          fill="#000000"
          class="select-none pointer-events-none"
        >${antenna.id}</text>
      `
    })
    svgContent += `</g>`
  })

  // Add legend with explicit styling
  svgContent += `
    <g transform="translate(${-legendWidth}, 0)">
      <rect x="0" y="0" width="${legendWidth}" height="${mapHeight}" fill="white" />
      <text x="10" y="20" font-size="14" font-weight="bold" fill="#000000">Legend</text>
      ${antennaGroups.filter(group => selectedGroups.has(group.id)).map((group, index) => `
        <g transform="translate(10, ${(index + 1) * 25 + 20})">
          <circle cx="0" cy="0" r="4" fill="${group.color}" />
          <text x="10" y="4" font-size="12" fill="#000000">${group.id} (${group.antennas.length})</text>
        </g>
      `).join('')}
      <g transform="translate(10, ${(antennaGroups.length + 1) * 25 + 20})">
        <circle cx="0" cy="0" r="6" fill="purple" class="masked-antenna" />
        <text x="10" y="4" font-size="12" fill="#000000">Masked Antenna</text>
      </g>
    </g>
  `

  // Chart title
  svgContent += `
    <text
      x="${mapWidth / 2}"
      y="-20"
      text-anchor="middle"
      font-size="16"
      font-weight="bold"
      fill="#000000"
    >Antenna Positions Grouped by ID</text>
  `

  // Close SVG
  svgContent += `
      </g>
    </svg>
  `

  return svgContent
}

