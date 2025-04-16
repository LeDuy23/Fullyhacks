
# ClaimAssist - Wildfire Insurance Claims Helper

## Overview

ClaimAssist is a comprehensive web application designed to streamline the documentation and processing of insurance claims following property damage from wildfires. Created during the Cal State Fullerton Hackathon, the application focuses on providing a user-friendly, supportive interface to help victims organize and file insurance claims efficiently.

## 🌟 Key Features

### Documentation & User Experience
- **Multi-step Guided Process**: Step-by-step interface to guide users through the entire claim documentation process
- **Room & Item Selection**: Visual interface for selecting rooms and documenting items with photos and details
- **Multi-language Support**: Internationalization features for broader accessibility
- **Currency Conversion**: Support for documenting items purchased in 15+ foreign currencies
- **Mobile-Responsive Design**: Optimized for use on any device, especially important in emergency situations

### AI-Powered Assistance
- **Price Estimation**: AI assists users with estimating replacement costs for lost items
- **Documentation Suggestions**: Helps users locate documentation sources like email receipts or photo libraries
- **Duplicate Detection**: Identifies potential duplicate entries to prevent claim issues

### Collaboration & Persistence
- **Multi-user Collaboration**: Family members can work together across sessions to complete inventory
- **Session Persistence**: Saves work in progress to prevent data loss

### Output Options
- **Customizable Templates**: Various document formats for organizing inventory information
- **PDF Generation**: Create professional-quality printable claim documents
- **Export Options**: With or without photos, detailed or summary views

## 🧑‍💻 Technology Stack

### Frontend
- **React + TypeScript**: For a robust, type-safe UI
- **TanStack Query**: For efficient data fetching and caching
- **Tailwind CSS + Shadcn UI**: For responsive, beautiful design
- **HTML2PDF.js**: For client-side PDF generation

### Backend
- **Node.js + Express**: For a lightweight, efficient server
- **PostgreSQL + Drizzle ORM**: For data persistence and schema management
- **OpenAI API**: For AI-powered assistance features

## 👥 Team

ClaimAssist was developed by a team of Computer Science students from Cal State Fullerton:

- **Duy Le**: Junior in CS, interested in AI and fintech
- **Jacob Fishel**: Junior in CS, interested in AI and machine learning
- **Philip Ma**: 3rd year CS student, interested in Fintech
- **Bryan Orozco**: Sophomore in CS, interested in working with large scale data and game development

## 🚀 Getting Started

### Prerequisites
- Node.js v18+ 
- PostgreSQL database
- OpenAI API key

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/claimassist.git
   cd claimassist
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file with the following variables:
   ```
   DATABASE_URL=postgresql://username:password@localhost:5432/claimassist
   OPENAI_API_KEY=your_openai_api_key
   ```

4. Initialize the database:
   ```bash
   npm run db:push
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

## 📱 Usage Guide

1. **Personal Information**: Enter your contact information and policy details
2. **Room Selection**: Select rooms affected by the wildfire
3. **Item Documentation**: For each room, document lost or damaged items:
   - Take or upload photos
   - Provide details (name, description, estimated value)
   - Utilize AI assistance for price estimates when needed
   - Use currency converter for items purchased abroad
4. **Review & Templates**: Review your documented items and select a template format
5. **Generate PDF**: Create a professional PDF document to submit to your insurance company

## 📄 Documentation Organization

The application helps users organize documentation from various sources:
- Purchase history from retailers (Amazon, Walmart, etc.)
- Email receipt searches
- Photo libraries (Google Photos, Apple Photos, etc.) 
- Credit card statements

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Cal State Fullerton Hackathon for the opportunity to develop this project
- Victims of wildfires who inspired us to create a tool that could help in the recovery process
