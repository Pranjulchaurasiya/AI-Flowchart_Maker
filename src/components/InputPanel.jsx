import { useState } from 'react'
import { FileText, Sparkles, Loader2, Image as ImageIcon } from 'lucide-react'
import { generateFromText, generateFromPrompt, generateFromImage } from '../services/api'

export default function InputPanel({ setNodes, setEdges, loading, setLoading }) {
  const [mode, setMode] = useState('text')
  const [input, setInput] = useState('')
  const [selectedFile, setSelectedFile] = useState(null)

  const handleGenerate = async () => {
    if (mode === 'image') {
      if (!selectedFile) return
      
      setLoading(true)
      try {
        const data = await generateFromImage(selectedFile)
        setNodes(data.nodes)
        setEdges(data.edges)
      } catch (error) {
        alert('Error: ' + error.message)
      } finally {
        setLoading(false)
      }
    } else {
      if (!input.trim()) return
      
      setLoading(true)
      try {
        const data = mode === 'text' 
          ? await generateFromText(input)
          : await generateFromPrompt(input)
        
        setNodes(data.nodes)
        setEdges(data.edges)
      } catch (error) {
        alert('Error: ' + error.message)
      } finally {
        setLoading(false)
      }
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setSelectedFile(file)
    }
  }

  return (
    <div className="w-96 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <div className="grid grid-cols-3 gap-2 mb-4">
          <button
            onClick={() => { setMode('text'); setSelectedFile(null); }}
            className={`py-2 px-3 rounded-lg flex items-center justify-center gap-2 transition ${
              mode === 'text' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <FileText size={16} />
            Text
          </button>
          <button
            onClick={() => { setMode('prompt'); setSelectedFile(null); }}
            className={`py-2 px-3 rounded-lg flex items-center justify-center gap-2 transition ${
              mode === 'prompt' 
                ? 'bg-purple-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Sparkles size={16} />
            Prompt
          </button>
          <button
            onClick={() => { setMode('image'); setInput(''); }}
            className={`py-2 px-3 rounded-lg flex items-center justify-center gap-2 transition ${
              mode === 'image' 
                ? 'bg-green-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <ImageIcon size={16} />
            Image
          </button>
        </div>
      </div>

      <div className="flex-1 p-4 flex flex-col">
        {mode === 'image' ? (
          <div className="flex-1 flex flex-col">
            <div className="flex-1 border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center hover:border-blue-500 transition">
              <ImageIcon size={48} className="text-gray-400 mb-4" />
              <label className="cursor-pointer">
                <span className="text-blue-600 hover:text-blue-700 font-semibold">
                  Choose Image or PDF
                </span>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
              {selectedFile && (
                <p className="mt-4 text-sm text-gray-600 text-center">
                  Selected: {selectedFile.name}
                </p>
              )}
            </div>
          </div>
        ) : (
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={mode === 'text' 
              ? 'Enter structured text:\nStart -> Process -> Decision -> End'
              : 'Describe your flowchart:\nCreate a user login process flowchart'
            }
            className="flex-1 p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        )}
        
        <button
          onClick={handleGenerate}
          disabled={loading || (mode === 'image' ? !selectedFile : !input.trim())}
          className="mt-4 py-3 px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles size={20} />
              Generate Flowchart
            </>
          )}
        </button>
      </div>
    </div>
  )
}
