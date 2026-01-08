preview : https://img-generation-frontend.onrender.com/
# Pixel AI - AI Image Generator 🎨

Pixel AI is a full-stack SaaS (Software as a Service) application that allows users to generate high-quality images from text prompts using advanced AI models. It features a complete user authentication system, subscription-based pricing models, and a personal gallery to manage generated artwork.

## 🚀 Features

* **AI Image Generation:** Converts text prompts into high-quality images using the Stable Diffusion XL model (via Hugging Face).
* **User Authentication:** Secure Signup, Login, and Logout functionality using JWT (JSON Web Tokens).
* **Subscription System:** Integrated Razorpay payment gateway for managing "Starter", "Growth", and "Scale" subscription plans.
* **Personal Gallery:** Users can view, manage, and download their generated images.
* **Responsive Design:** Modern, dark-themed UI built with React and Tailwind CSS that works seamlessly on desktop and mobile.
* **Cloud Storage:** All generated images are securely stored using Cloudinary.

## 🛠️ Tech Stack

**Frontend:**
* React.js (Vite)
* Tailwind CSS
* React Router DOM
* Axios

**Backend:**
* Node.js & Express.js
* MongoDB & Mongoose
* JWT (Authentication)

**Services & APIs:**
* **AI Model:** Hugging Face Inference API (Stable Diffusion XL)
* **Storage:** Cloudinary
* **Payments:** Razorpay

## ⚙️ Environment Variables

To run this project, you will need to add the following environment variables to your `.env` file in the `backend` folder:

```env
# Server Configuration
PORT=5000
MONGO_URI=your_mongodb_connection_string

# Authentication
JWT_SECRET=your_jwt_secret_key

# AI Provider (Hugging Face)
AI_API_KEY=your_hugging_face_token

# Image Storage (Cloudinary)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Payments (Razorpay)
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret


🚀 Getting Started
Prerequisites
Node.js (v14 or higher)

MongoDB (Local or Atlas)

1)Installation
Clone the repositorygit clone [https://github.com/yug-thummar/img-generation-model.git](https://github.com/yug-thummar/img-generation-model.git)
cd img-generation-model

2)Setup Backend
cd backend
npm install
# Create .env file with variables listed above
npm start

3)Setup Frontend
cd frontend
npm install
npm run dev

4)Access the App Open http://localhost:3000 to view the application.
