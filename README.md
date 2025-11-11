# RoBERTaNET Cyberbullying Detection

This project implements a cyberbullying detection system using a custom RoBERTa-based neural network, with a Next.js dashboard for real-time monitoring and analytics.

## Features
- Custom RoBERTaNET model for text classification
- Data preprocessing and sample dataset generation
- Training, validation, and testing pipeline
- Real-time monitoring dashboard (Next.js)
- High-risk detection alerts and analytics

## Project Structure
```
├── app/                  # Next.js frontend (dashboard, monitor, API)
├── components/           # React components (dashboard, monitor, UI)
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions
├── public/               # Static assets
├── scripts/              # Python ML scripts
│   ├── data_preprocessing.py
│   ├── model_architecture.py
│   ├── model_evaluation.py
│   ├── train_model.py
│   └── requirements.txt
├── styles/               # CSS files
├── package.json          # Node.js dependencies
├── tsconfig.json         # TypeScript config
└── README.md             # Project documentation
```

## Setup Instructions

### 1. Python Environment (ML Backend)
1. Navigate to the `scripts/` directory:
   ```sh
   cd scripts
   ```
2. Create a virtual environment and activate it:
   ```sh
   python -m venv .venv
   # On Windows:
   .venv\Scripts\activate
   # On macOS/Linux:
   source .venv/bin/activate
   ```
3. Install dependencies:
   ```sh
   pip install -r requirements.txt
   ```
4. Run the training pipeline:
   ```sh
   python train_model.py
   ```

### 2. Next.js Dashboard (Frontend)
1. Go to the project root:
   ```sh
   cd ..
   ```
2. Install Node.js dependencies:
   ```sh
   npm install
   ```
3. Start the development server:
   ```sh
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage
- Train the model using the Python scripts in `scripts/`.
- Monitor real-time results and analytics on the Next.js dashboard.
- High-risk detections and alerts are shown in the dashboard for review.

## Authors
- Sanjay

## License
This project is for educational and research purposes.
