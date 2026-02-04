# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

# KIDDOO - Mental Health Support Agent

A compassionate AI-powered mental health companion that provides emotional support, crisis detection, and emergency response capabilities.

## 🚨 Real-Time SOS Emergency System

KIDDOO features a fully integrated emergency response system powered by Twilio SMS.

### Features
- **Automatic Crisis Detection**: Identifies critical distress keywords and autonomously triggers emergency alerts
- **Manual SOS Button**: Users can instantly trigger emergency alerts
- **Location Awareness**: Shares precise GPS coordinates with emergency contacts
- **Real-time Status Updates**: Visual feedback on SMS delivery status
- **Multi-contact Notification**: Sends alerts to multiple emergency contacts simultaneously

### How It Works
1. **Detection**: System monitors conversations for crisis indicators
2. **Trigger**: Either automatically (critical keywords) or manually (SOS button)
3. **Location**: Requests user's current location (with permission)
4. **Notification**: Sends detailed SMS to all emergency contacts with:
   - User identification
   - Timestamp
   - Precise location with Google Maps link
   - Urgency level

### Setup Instructions
See [TWILIO_SETUP_GUIDE.md](./TWILIO_SETUP_GUIDE.md) for complete setup instructions.

### Testing
```bash
# Test backend service
python api/test_sos.py

# Check service health
curl http://localhost:5000/api/health
```
