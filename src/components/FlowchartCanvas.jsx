import { useCallback, useEffect, useState, useRef } from 'react'
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  useReactFlow,
  getRectOfNodes,
  getTransformForBounds,
  Panel,
} from 'reactflow'
import 'reactflow/dist/style.css'
import { Download, ArrowDownUp, ChevronDown } from 'lucide-react'
import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'

export default function FlowchartCanvas({ nodes, edges, setNodes, setEdges }) {
  const [localNodes, setLocalNodes, onNodesChange] = useNodesState(nodes)
  const [localEdges, setLocalEdges, onEdgesChange] = useEdgesState(edges)
  const [showExportMenu, setShowExportMenu] = useState(false)
  const [direction, setDirection] = useState('TB')
  const { getNodes } = useReactFlow()
  const flowRef = useRef(null)

  useEffect(() => {
    setLocalNodes(nodes)
  }, [nodes, setLocalNodes])

  useEffect(() => {
    setLocalEdges(edges)
  }, [edges, setLocalEdges])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showExportMenu && !event.target.closest('.export-menu-container')) {
        setShowExportMenu(false)
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showExportMenu])

  const onConnect = useCallback(
    (params) => setLocalEdges((eds) => addEdge(params, eds)),
    [setLocalEdges]
  )

  const changeOrientation = () => {
    const newDirection = direction === 'TB' ? 'LR' : 'TB'
    setDirection(newDirection)
    
    const updatedNodes = localNodes.map((node, index) => {
      if (newDirection === 'LR') {
        return {
          ...node,
          position: { x: index * 200, y: 250 }
        }
      } else {
        return {
          ...node,
          position: { x: 250, y: index * 100 }
        }
      }
    })
    
    setLocalNodes(updatedNodes)
  }

  const downloadJSON = () => {
    const data = { nodes: localNodes, edges: localEdges }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'flowchart.json'
    a.click()
    setShowExportMenu(false)
  }

  const downloadPNG = async () => {
    const flowElement = document.querySelector('.react-flow')
    if (!flowElement) return

    const canvas = await html2canvas(flowElement, {
      backgroundColor: '#ffffff',
      scale: 2
    })
    
    const link = document.createElement('a')
    link.download = 'flowchart.png'
    link.href = canvas.toDataURL('image/png')
    link.click()
    setShowExportMenu(false)
  }

  const downloadSVG = () => {
    const flowElement = document.querySelector('.react-flow__viewport')
    if (!flowElement) return

    const svgData = `
      <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800">
        <foreignObject width="100%" height="100%">
          <div xmlns="http://www.w3.org/1999/xhtml">
            ${flowElement.innerHTML}
          </div>
        </foreignObject>
      </svg>
    `
    
    const blob = new Blob([svgData], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'flowchart.svg'
    a.click()
    setShowExportMenu(false)
  }

  const downloadPDF = async () => {
    const flowElement = document.querySelector('.react-flow')
    if (!flowElement) return

    const canvas = await html2canvas(flowElement, {
      backgroundColor: '#ffffff',
      scale: 2
    })
    
    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF({
      orientation: canvas.width > canvas.height ? 'landscape' : 'portrait',
      unit: 'px',
      format: [canvas.width, canvas.height]
    })
    
    pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height)
    pdf.save('flowchart.pdf')
    setShowExportMenu(false)
  }

  return (
    <div className="flex-1 relative" ref={flowRef}>
      {localNodes.length > 0 && (
        <div className="absolute top-4 right-4 z-10 flex gap-2">
          <button
            onClick={changeOrientation}
            className="bg-white px-4 py-2 rounded-lg shadow-lg hover:shadow-xl transition flex items-center gap-2 border border-gray-200"
            title="Change Orientation"
          >
            <ArrowDownUp size={18} />
            {direction === 'TB' ? 'Vertical' : 'Horizontal'}
          </button>
          
          <div className="relative export-menu-container">
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="bg-white px-4 py-2 rounded-lg shadow-lg hover:shadow-xl transition flex items-center gap-2 border border-gray-200"
            >
              <Download size={18} />
              Export
              <ChevronDown size={16} />
            </button>
            
            {showExportMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden">
                <button
                  onClick={downloadPNG}
                  className="w-full px-4 py-3 text-left hover:bg-gray-100 transition flex items-center gap-2 text-gray-700"
                >
                  <Download size={16} />
                  Export as PNG
                </button>
                <button
                  onClick={downloadSVG}
                  className="w-full px-4 py-3 text-left hover:bg-gray-100 transition flex items-center gap-2 text-gray-700"
                >
                  <Download size={16} />
                  Export as SVG
                </button>
                <button
                  onClick={downloadPDF}
                  className="w-full px-4 py-3 text-left hover:bg-gray-100 transition flex items-center gap-2 text-gray-700"
                >
                  <Download size={16} />
                  Export as PDF
                </button>
                <button
                  onClick={downloadJSON}
                  className="w-full px-4 py-3 text-left hover:bg-gray-100 transition flex items-center gap-2 text-gray-700"
                >
                  <Download size={16} />
                  Export as JSON
                </button>
              </div>
            )}
          </div>
        </div>
      )}
      
      <ReactFlow
        nodes={localNodes}
        edges={localEdges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      >
        <Controls />
        <MiniMap />
        <Background variant="dots" gap={12} size={1} />
      </ReactFlow>
    </div>
  )
}
