import json
import re
import base64
from io import BytesIO
from groq import Groq
from PIL import Image
import fitz

class FlowchartGenerator:
    def __init__(self, api_key):
        self.client = Groq(api_key=api_key)
        
    def text_to_flowchart(self, text):
        lines = [line.strip() for line in text.split('\n') if line.strip()]
        nodes = []
        edges = []
        node_map = {}
        
        y_position = 0
        for idx, line in enumerate(lines):
            parts = re.split(r'\s*->\s*', line)
            
            for part in parts:
                if part and part not in node_map:
                    node_type = self._determine_node_type(part)
                    node_id = f"node_{len(nodes)}"
                    
                    nodes.append({
                        "id": node_id,
                        "type": "default",
                        "data": {"label": part},
                        "position": {"x": 250, "y": y_position},
                        "style": self._get_node_style(node_type)
                    })
                    
                    node_map[part] = node_id
                    y_position += 100
            
            for i in range(len(parts) - 1):
                if parts[i] and parts[i+1]:
                    edges.append({
                        "id": f"edge_{len(edges)}",
                        "source": node_map[parts[i]],
                        "target": node_map[parts[i+1]],
                        "animated": True
                    })
        
        return {
            "nodes": nodes,
            "edges": edges,
            "metadata": {"source": "text", "node_count": len(nodes)}
        }
    
    async def prompt_to_flowchart(self, prompt):
        system_prompt = """You are a flowchart generation expert. Convert user descriptions into structured flowchart data.
Return ONLY valid JSON with this exact structure:
{
  "nodes": [{"id": "node_0", "type": "default", "data": {"label": "Start"}, "position": {"x": 250, "y": 0}, "style": {"background": "#4ade80", "color": "white", "border": "2px solid #22c55e"}}],
  "edges": [{"id": "edge_0", "source": "node_0", "target": "node_1", "animated": true}],
  "metadata": {"source": "prompt", "node_count": 3}
}

Node style colors:
- Start/End: green (#4ade80)
- Process: blue (#60a5fa)
- Decision: yellow (#fbbf24)
- Default: gray (#94a3b8)"""

        response = self.client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": f"Create a flowchart for: {prompt}"}
            ],
            temperature=0.7,
            max_tokens=2000
        )
        
        content = response.choices[0].message.content.strip()
        
        json_match = re.search(r'\{.*\}', content, re.DOTALL)
        if json_match:
            content = json_match.group(0)
        
        try:
            result = json.loads(content)
            return result
        except json.JSONDecodeError:
            return self._create_fallback_flowchart(prompt)
    
    def _determine_node_type(self, text):
        text_lower = text.lower()
        if any(word in text_lower for word in ['start', 'begin']):
            return 'start'
        elif any(word in text_lower for word in ['end', 'finish', 'stop']):
            return 'end'
        elif any(word in text_lower for word in ['if', 'decision', 'check', '?']):
            return 'decision'
        elif any(word in text_lower for word in ['process', 'do', 'execute']):
            return 'process'
        return 'default'
    
    def _get_node_style(self, node_type):
        styles = {
            'start': {"background": "#4ade80", "color": "white", "border": "2px solid #22c55e", "padding": "10px", "borderRadius": "8px"},
            'end': {"background": "#4ade80", "color": "white", "border": "2px solid #22c55e", "padding": "10px", "borderRadius": "8px"},
            'decision': {"background": "#fbbf24", "color": "white", "border": "2px solid #f59e0b", "padding": "10px", "borderRadius": "8px"},
            'process': {"background": "#60a5fa", "color": "white", "border": "2px solid #3b82f6", "padding": "10px", "borderRadius": "8px"},
            'default': {"background": "#94a3b8", "color": "white", "border": "2px solid #64748b", "padding": "10px", "borderRadius": "8px"}
        }
        return styles.get(node_type, styles['default'])
    
    def _create_fallback_flowchart(self, prompt):
        return {
            "nodes": [
                {"id": "node_0", "type": "default", "data": {"label": "Start"}, "position": {"x": 250, "y": 0}, "style": self._get_node_style('start')},
                {"id": "node_1", "type": "default", "data": {"label": prompt[:30]}, "position": {"x": 250, "y": 100}, "style": self._get_node_style('process')},
                {"id": "node_2", "type": "default", "data": {"label": "End"}, "position": {"x": 250, "y": 200}, "style": self._get_node_style('end')}
            ],
            "edges": [
                {"id": "edge_0", "source": "node_0", "target": "node_1", "animated": True},
                {"id": "edge_1", "source": "node_1", "target": "node_2", "animated": True}
            ],
            "metadata": {"source": "prompt", "node_count": 3}
        }
    
    async def image_to_flowchart(self, file_content: bytes, filename: str):
        try:
            if filename.lower().endswith('.pdf'):
                image_base64 = self._pdf_to_image(file_content)
            else:
                image_base64 = self._image_to_base64(file_content)
            
            system_prompt = """You are a flowchart analysis expert. Analyze the image and extract or create a flowchart structure.
Return ONLY valid JSON with this exact structure:
{
  "nodes": [{"id": "node_0", "type": "default", "data": {"label": "Start"}, "position": {"x": 250, "y": 0}, "style": {"background": "#4ade80", "color": "white", "border": "2px solid #22c55e", "padding": "10px", "borderRadius": "8px"}}],
  "edges": [{"id": "edge_0", "source": "node_0", "target": "node_1", "animated": true}],
  "metadata": {"source": "image", "node_count": 3}
}"""

            response = self.client.chat.completions.create(
                model="llama-3.2-11b-vision-preview",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {
                        "role": "user",
                        "content": [
                            {"type": "text", "text": "Analyze this image and create a flowchart structure. If it contains a flowchart, extract it. If it's a diagram or text, convert it to a flowchart."},
                            {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{image_base64}"}}
                        ]
                    }
                ],
                temperature=0.5,
                max_tokens=2000
            )
            
            content = response.choices[0].message.content.strip()
            json_match = re.search(r'\{.*\}', content, re.DOTALL)
            if json_match:
                content = json_match.group(0)
            
            result = json.loads(content)
            return result
        except Exception as e:
            return self._create_fallback_flowchart(f"Image analysis: {filename}")
    
    def _image_to_base64(self, file_content: bytes) -> str:
        image = Image.open(BytesIO(file_content))
        if image.mode in ('RGBA', 'LA', 'P'):
            image = image.convert('RGB')
        
        max_size = (1024, 1024)
        image.thumbnail(max_size, Image.Resampling.LANCZOS)
        
        buffer = BytesIO()
        image.save(buffer, format='JPEG', quality=85)
        return base64.b64encode(buffer.getvalue()).decode('utf-8')
    
    def _pdf_to_image(self, file_content: bytes) -> str:
        pdf_document = fitz.open(stream=file_content, filetype="pdf")
        page = pdf_document[0]
        
        pix = page.get_pixmap(matrix=fitz.Matrix(2, 2))
        img_data = pix.tobytes("jpeg")
        
        return base64.b64encode(img_data).decode('utf-8')
