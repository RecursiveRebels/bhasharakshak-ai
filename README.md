# BhashaRakshak AI 🇮🇳
### *Preserving India's Linguistic Heritage using AI*

BhashaRakshak is a full-stack AI platform designed to digitize, preserve, and empower indigenous Indian languages. It enables users to contribute voice datasets, translate content using advanced AI, and access educational resources.

[![GitHub](https://img.shields.io/badge/GitHub-RecursiveRebels-blue)](https://github.com/RecursiveRebels/bhasharakshak-ai)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## 🌟 Features

- **Voice Contribution**: Record and contribute voice samples in 50+ Indian languages
- **AI Translation**: Translate text between Indian languages using advanced AI
- **Text-to-Speech**: Natural-sounding speech synthesis for Indian languages
- **Language Gallery**: Explore and learn about India's linguistic diversity
- **Interactive Map**: Visualize language distribution across India
- **Private Collections**: Save recordings privately before making them public
- **Gamification**: Earn badges and track contributions
- **Dark Mode**: Beautiful UI with dark mode support

---

## 🏗️ Architecture

```
┌─────────────────┐      ┌──────────────────┐      ┌─────────────────┐
│   Frontend      │─────▶│    Backend       │─────▶│   AI Services   │
│   (React)       │      │  (Spring Boot)   │      │   (FastAPI)     │
│   Port: 5173    │      │   Port: 8080     │      │   Port: 8000    │
└─────────────────┘      └──────────────────┘      └─────────────────┘
                                  │
                                  ▼
                         ┌──────────────────┐
                         │   MongoDB Atlas  │
                         │   (Cloud DB)     │
                         └──────────────────┘
```

---

## 🚀 Tech Stack

### Frontend (User Interface)
- **React 18** with **Vite** - Lightning-fast development
- **TailwindCSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations
- **Axios** - HTTP client
- **React Router** - Navigation
- **i18next** - Internationalization
- **Leaflet** - Interactive maps

### Backend (API & Logic)
- **Spring Boot 3.2.2** - Java framework
- **Spring Data MongoDB** - Database integration
- **Spring Security** - Authentication & authorization
- **GridFS** - File storage
- **Lombok** - Reduce boilerplate code

### AI Services (Intelligence Layer)
- **FastAPI** - High-performance Python web framework
- **Edge-TTS** - Neural text-to-speech
- **Deep Translator** - Multi-language translation
- **SpeechRecognition** - Speech-to-text
- **gTTS** - Google Text-to-Speech (fallback)

### Database
- **MongoDB Atlas** - Cloud-hosted NoSQL database

---

## 🛠️ Prerequisites

Before running the project, ensure you have the following installed:

| Tool | Version | Download Link |
|------|---------|---------------|
| **Java JDK** | 17+ | [Download](https://www.oracle.com/java/technologies/downloads/) |
| **Node.js** | 18+ | [Download](https://nodejs.org/) |
| **Python** | 3.9+ | [Download](https://www.python.org/downloads/) |
| **Git** | Latest | [Download](https://git-scm.com/) |

---

## 📦 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/RecursiveRebels/bhasharakshak-ai.git
cd bhasharakshak-ai
```

### 2. Configure Environment

Create a `.env` file in the `backend/springapp` directory with your MongoDB connection:

```env
SPRING_DATA_MONGODB_URI=your_mongodb_connection_string
```

### 3. Install Dependencies

#### Frontend
```bash
cd frontend/reactapp
npm install
```

#### Backend
```bash
cd backend/springapp
# Dependencies will be downloaded automatically by Maven
```

#### AI Services
```bash
cd ai-services
pip install -r requirements.txt
```

---

## 🚀 Running the Application

You need to run **3 services** simultaneously. Open 3 separate terminal windows:

### Terminal 1: AI Services (Python)
```bash
cd ai-services
python main.py
```
✅ Runs on: **http://localhost:8000**

### Terminal 2: Backend (Java Spring Boot)
```bash
cd backend/springapp

# Windows
mvnw.cmd spring-boot:run

# Linux/Mac
./mvnw spring-boot:run
```
✅ Runs on: **http://localhost:8080**

### Terminal 3: Frontend (React)
```bash
cd frontend/reactapp
npm run dev
```
✅ Runs on: **http://localhost:5173**

---

## 🎯 Accessing the Application

Once all services are running:

1. Open your browser and navigate to: **http://localhost:5173**
2. The application should load with the home page
3. Try the following features:
   - **Contribute**: Record voice samples
   - **Translate**: Translate text between languages
   - **Learn**: Explore language resources
   - **My Collections**: View your private recordings

---

## 📂 Project Structure

```
bhasharakshak-ai/
├── frontend/
│   └── reactapp/              # React frontend application
│       ├── src/
│       │   ├── components/    # Reusable UI components
│       │   ├── pages/         # Page components
│       │   ├── services/      # API services
│       │   ├── context/       # React context providers
│       │   └── utils/         # Utility functions
│       ├── public/            # Static assets
│       └── package.json       # Frontend dependencies
│
├── backend/
│   └── springapp/             # Spring Boot backend
│       ├── src/main/java/com/bhasharakshak/
│       │   ├── controller/    # REST API controllers
│       │   ├── model/         # Data models
│       │   ├── repository/    # Database repositories
│       │   ├── service/       # Business logic
│       │   └── config/        # Configuration classes
│       └── pom.xml            # Backend dependencies
│
├── ai-services/               # FastAPI AI services
│   ├── main.py               # Main FastAPI application
│   ├── requirements.txt      # Python dependencies
│   └── uploads/              # Temporary file storage
│
├── .gitignore                # Git ignore rules
└── README.md                 # This file
```

---

## 🔧 Configuration

### MongoDB Connection

The application uses MongoDB Atlas for data storage. Update your connection string in:
- `backend/springapp/src/main/resources/application.properties`

### CORS Configuration

CORS is configured to allow requests from `http://localhost:5173`. Update in:
- `backend/springapp/src/main/java/com/bhasharakshak/config/SecurityConfig.java`

### API Endpoints

| Service | Base URL | Purpose |
|---------|----------|---------|
| Frontend | http://localhost:5173 | User interface |
| Backend | http://localhost:8080/api/v1 | REST API |
| AI Services | http://localhost:8000 | AI endpoints |

---

## 🧪 Testing

### Test Voice Recording
1. Navigate to `/contribute`
2. Click "Start Recording"
3. Speak in any Indian language
4. Fill in language details
5. Submit contribution

### Test Translation
1. Navigate to `/translate`
2. Enter text in any language
3. Select target language
4. Click "Translate"
5. Listen to the audio output

---

## 🐛 Troubleshooting

### Backend won't start
- Ensure Java 17+ is installed: `java -version`
- Check MongoDB connection string
- Verify port 8080 is not in use

### Frontend won't start
- Ensure Node.js 18+ is installed: `node -v`
- Delete `node_modules` and run `npm install` again
- Verify port 5173 is not in use

### AI Services won't start
- Ensure Python 3.9+ is installed: `python --version`
- Install dependencies: `pip install -r requirements.txt`
- Verify port 8000 is not in use

### Private collections showing 404
- Restart the backend server to compile all controllers
- Check browser console for errors
- Verify MongoDB connection

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Team - Recursive Rebels

Built with ❤️ for preserving India's linguistic heritage.

---

## 📞 Support

For issues and questions:
- Open an issue on [GitHub](https://github.com/RecursiveRebels/bhasharakshak-ai/issues)
- Contact the team

---

## 🙏 Acknowledgments

- Smart India Hackathon 2025
- All contributors and language enthusiasts
- Open-source community

---

**Made in India 🇮🇳 | Preserving Our Languages for Future Generations**
