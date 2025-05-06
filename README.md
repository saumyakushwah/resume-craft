# ResumeCraft

**ResumeCraft** is a step-based platform designed to help users easily create and manage their professional profiles. It guides users through a series of steps to input essential details such as personal information, skills, education, a professional summary, and resume uploads. This structured approach allows users to provide all the necessary details for job applications in an intuitive way. 

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/pages/api-reference/create-next-app).

## 🚀 Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

---

## ✨ Features

ResumeCraft offers a smooth and intuitive resume-building experience with the following features:

- 📄 **Resume Upload**
  - Upload your resume via file browser or drag-and-drop interface
  - Real-time upload loader with linear progress bar and file size display
  - Option to remove uploaded resume file

- 🧾 **Basic Information Form**
  - Input form with proper field validations
  - Country dropdown with pre-populated options

- 💡 **Skills Section**
  - Dynamically add multiple skills
  - Drag and reorder skills using drag-and-drop
  - Skill field validations and easy removal

- 🎓 **Education Section**
  - Add multiple education entries dynamically
  - Drag and reorder education entries
  - Valid year format checks and entry removal

- 🧩 **Summary Page**
  - View all entered details in the order submitted
  - Edit any section before final submission
  - Download resume file as a PDF

- 🪜 **Custom Stepper Navigation**
  - Step-based form navigation with a custom-designed stepper
  - **Validation on “Next” click**: Prevents proceeding to the next step until the current step’s fields are valid
  - **Validation on step click (direct navigation)**: Prevents skipping ahead unless all previous steps are valid

- ✅ **Robust Form Handling**
  - Complete form and state validations
  - Dynamic fields with responsive drag-and-drop support

- 📱 **UI & UX**
  - Fully responsive design
  - UI adheres closely to the Figma design for visual consistency

- 💾 **Bonus Feature: Local Storage**
  - Form progress is automatically saved to local storage
  - Data is preserved even on page refresh or accidental tab close

---

## Live Demo

You can try out ResumeCraft live here:  
🔗 [https://resume-craft-beige.vercel.app/](https://resume-craft-beige.vercel.app/)
