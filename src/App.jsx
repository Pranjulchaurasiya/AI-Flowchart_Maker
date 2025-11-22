import { useState } from 'react'
import { ReactFlowProvider } from 'reactflow'
import FlowchartCanvas from './components/FlowchartCanvas'
import InputPanel from './components/InputPanel'
import { Workflow } from 'lucide-react'

function App() {
  const [nodes, setNodes] = useState([])
  const [edges, setEdges] = useState([])
  const [loading, setLoading] = useState(false)

  return (
    <ReactFlowProvider>
      <div className="h-screen flex flex-col bg-gray-50">
        <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 shadow-lg">
          <div className="container mx-auto flex items-center gap-3">
            <Workflow size={32} />
            <h1 className="text-2xl font-bold">AI Flowchart Maker</h1>
          </div>
        </header>
        
        <div className="flex-1 flex overflow-hidden">
          <InputPanel 
            setNodes={setNodes} 
            setEdges={setEdges}
            loading={loading}
            setLoading={setLoading}
          />
          <FlowchartCanvas 
            nodes={nodes} 
            edges={edges}
            setNodes={setNodes}
            setEdges={setEdges}
          />
        </div>
      </div>
    </ReactFlowProvider>
  )
}

export default App
