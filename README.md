# AI Flowchart Maker

A web-based application that generates flowcharts automatically from text prompts, instructions, or uploaded files. The tool converts natural language descriptions into structured flowcharts with a clean and intuitive user interface. It supports customization, real-time editing, and export options for PDF, PNG,JSON and SVG formats.

# Interface
<img width="2879" height="1559" alt="image" src="https://github.com/user-attachments/assets/41568b4d-13e9-4d5b-b781-75d327078e2a" />

---

## Key Features

* Converts natural language instructions into flowcharts.
* Supports input through text, lines, or structured descriptions.
* Real-time preview of generated flowcharts.
* Includes a modern and clean user interface.
* Allows editing, rearranging, and customizing nodes and edges.
* Export options for PDF, PNG, and SVG.
* Backend powered by Python and AI-based layout generation.
* Frontend built for fast rendering and smooth interactions.
* Upload-to-flowchart support for images or structured files.

---

## Technology Stack

### Frontend

* HTML
* CSS
* JavaScript (React optional if used in your version)

### Backend

* Python
* Flask
* Custom AI layout engine
* Text parsing and flow generation modules

### Additional Tools

* Image processing utilities
* Export service (PDF/PNG/SVG)
* Node layout and coordinate algorithms

---

## Folder Structure

```
AI-Flowchart-Builder/
├── .kiro/settings/
│         └── mcp.json
├── backend/
│   ├── main.py
│   ├── requirements.txt
│   ├── services/
│   │   ├── ai_generator.py
│   │   ├── export_service.py
│   │   ├── image_processor.py
│   │   ├── layout_engine.py
│   │   └── text_parser.py
│   └── .env.example
│
├── frontend/
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   ├── postcss.config.js
│   └── src/
│       ├── App.jsx
│       ├── components/
│       │   ├── CustomNode.jsx
│       │   ├── ExampleChips.jsx
│       │   ├── ExportPanel.jsx
│       │   ├── FlowchartCanvas.jsx
│       │   └── InputPanel.jsx
│
├── start-frontend.sh  
├── start-backend.sh  
├── start-frontend.bat  
└── README.md  
```

---

## Installation and Setup

### 1. Clone the Repository

```
git clone https://github.com/Pranjulchaurasiya/AI-flowchart-maker.git
cd AI-flowchart-maker
```

### 2. Backend Setup

```
cd backend
pip install -r requirements.txt
python main.py
```

The backend will start on the configured host and port.

### 3. Frontend Setup

```
cd ../frontend
npm install
npm start
```

The frontend will run on the local development server.

---

## How the System Works

1. User enters a prompt, lines, or structured instructions.
2. The backend processes the text using the text parser.
3. AI-based flowchart generator creates nodes and edges.
4. The layout engine arranges elements cleanly.
5. The frontend displays the flowchart on a canvas.
6. Users can edit, move, or customize flowchart nodes.
7. The export service converts the final flowchart into PDF, SVG, or PNG.

---

## Unique Selling Points

* Reduces manual flowchart creation time significantly.
* Offers clean and tidy layouts with automated spacing.
* Suitable for students, developers, educators, and professionals.
* Works with natural language, making it accessible to non-technical users.
* Lightweight and fast due to optimized layout algorithms.

---

## Future Enhancements

* Support for complex workflows and branching logic.
* Live collaboration mode for teams.
* Cloud storage integration.
* Authentication system for user accounts.
* Version history and auto-save.
* Integration with documentation tools.

---

## License

This project is licensed under the MIT License.
You are free to use, modify, and distribute the code with proper attribution.

---
