import { Button } from "@/components/ui/button"
import { Download } from 'lucide-react'

interface ExportSVGButtonProps {
  svgContent: string;
}

export function ExportSVGButton({ svgContent }: ExportSVGButtonProps) {
  const handleExport = () => {
    const blob = new Blob([svgContent], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "antenna_map.svg";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <Button onClick={handleExport} variant="outline">
      <Download className="mr-2 h-4 w-4" />
      Export SVG
    </Button>
  );
}

