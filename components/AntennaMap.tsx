'use client'

import { useState, useCallback, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { generateAntennaMapSVG } from '@/lib/svgMapGenerator'
import { antennaGroups } from '@/lib/antennaData'
import { Antenna } from '@/lib/types'
import { AntennaPopup } from './AntennaPopup'
import { FileUpload } from './FileUpload'
import { Download } from 'lucide-react'

export function AntennaMap() {
  const [selectedAntenna, setSelectedAntenna] = useState<Antenna | null>(null)
  const [selectedGroups, setSelectedGroups] = useState<Set<string>>(new Set())
  const [showConnections, setShowConnections] = useState(true)
  const [dataLoaded, setDataLoaded] = useState(false)

  const handleAntennaClick = useCallback((antenna: Antenna) => {
    setSelectedAntenna(antenna)
  }, [])

  useEffect(() => {
    window.handleAntennaClick = handleAntennaClick
  }, [handleAntennaClick])

  const handleGroupToggle = (group: string) => {
    setSelectedGroups((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(group)) {
        newSet.delete(group)
      } else {
        newSet.add(group)
      }
      return newSet
    })
  }

  const handleDataLoaded = () => {
    setDataLoaded(true)
    setSelectedGroups(new Set(antennaGroups.map(group => group.id)))
  }

  const filteredAntennas = antennaGroups
    .filter(group => selectedGroups.has(group.id))
    .flatMap(group => group.antennas)

  const svgContent = generateAntennaMapSVG(filteredAntennas, handleAntennaClick, selectedGroups, antennaGroups)

  const handleExportSVG = () => {
    const blob = new Blob([svgContent], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'antenna_map.svg'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Antenna Map Configuration</CardTitle>
          <CardDescription>Upload YAML file and configure map settings</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="upload" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="upload">Upload YAML</TabsTrigger>
              <TabsTrigger value="controls">Map Controls</TabsTrigger>
            </TabsList>
            <TabsContent value="upload">
              <FileUpload onDataLoaded={handleDataLoaded} />
            </TabsContent>
            <TabsContent value="controls">
              {dataLoaded ? (
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="show-connections"
                      checked={showConnections}
                      onCheckedChange={setShowConnections}
                    />
                    <Label htmlFor="show-connections">Show Connections</Label>
                  </div>
                  <ScrollArea className="h-[300px] w-full rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[100px]">Visible</TableHead>
                          <TableHead>Group ID</TableHead>
                          <TableHead>Nodes</TableHead>
                          <TableHead>Color</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {antennaGroups.map((group) => (
                          <TableRow key={group.id}>
                            <TableCell className="font-medium">
                              <Checkbox
                                id={group.id}
                                checked={selectedGroups.has(group.id)}
                                onCheckedChange={() => handleGroupToggle(group.id)}
                              />
                            </TableCell>
                            <TableCell>
                              <Label htmlFor={group.id} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                {group.id}
                              </Label>
                            </TableCell>
                            <TableCell>{group.antennas.length}</TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <div className="w-4 h-4 rounded-full" style={{backgroundColor: group.color}}></div>
                                <span className="text-sm">{group.color}</span>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Please upload a YAML file first.</p>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      {dataLoaded && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Antenna Position Map</CardTitle>
              <CardDescription>Interactive map of antenna positions</CardDescription>
            </div>
            <Button onClick={handleExportSVG} variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export SVG
            </Button>
          </CardHeader>
          <CardContent>
            <div 
              key={Array.from(selectedGroups).join(',')}
              dangerouslySetInnerHTML={{ __html: svgContent }} 
              className={`w-full h-[600px] overflow-auto ${showConnections ? '' : '[&_path]:hidden'}`}
            />
          </CardContent>
        </Card>
      )}
      {selectedAntenna && (
        <AntennaPopup antenna={selectedAntenna} onClose={() => setSelectedAntenna(null)} />
      )}
    </div>
  )
}

