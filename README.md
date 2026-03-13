# Stanza 🖋️

Stanza is a premium, modern blog platform designed for storytellers. It features a sleek, human-centric design with a powerful backend supporting a full range of social and publishing features.

## ✨ Features

- **Auth System**: Secure signup and login using Django REST Framework and SimpleJWT.
- **Storytelling**: Create, edit, and delete beautiful blog posts with image support.
- **Social Integration**: 
  - **Follow & Following**: Connect with your favorite authors.
  - **Support Author**: A "Like" system to appreciate great stories.
  - **Threaded Discussions**: Engaging comment sections for every story.
- **Rich Profiles**: 
  - Personalized biographies and avatar uploads.
  - **Dynamic Public Profiles**: Showcasing author stories and impact.
  - **Impact Metrics**: Track Followers, Following, and total "Support" (total likes received).
- **Modern UI**: Built with Next.js, featuring smooth animations, premium typography (Spectral/Inter), and a clean, minimal aesthetic.

## 🛠️ Tech Stack

- **Frontend**: Next.js 14+ (Turbopack), React, Tailwind CSS / Modern CSS.
- **Backend**: Django 4.2+, Django REST Framework.
- **Authentication**: JWT (JSON Web Tokens).
- **Database**: SQLite (Development).
- **Image Handling**: Pillow for avatar and blog image processing.

## 🚀 Getting Started

### Prerequisites
- Node.js & npm
- Python 3.9+

### Backend Setup
1. Navigate to the server directory:
   ```bash
   cd server/server_login_signup
   ```
2. Install dependencies:
   ```bash
   pip install django djangorestframework django-cors-headers djangorestframework-simplejwt pillow
   ```
3. Run migrations:
   ```bash
   python manage.py migrate
   ```
4. Start the server:
   ```bash
   python manage.py runserver
   ```

### Frontend Setup
1. Navigate to the client directory:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
