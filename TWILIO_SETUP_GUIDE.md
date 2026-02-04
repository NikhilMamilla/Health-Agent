# 🚨 Twilio SOS Setup Guide

## Overview
This guide will help you configure Twilio for real-time SMS emergency alerts in your KIDDOO mental health application.

---

## ✅ What's Already Implemented

1. **Backend SOS Service** (`api/services/sos_service.py`)
   - Real Twilio integration with error handling
   - Location-aware messaging
   - Detailed logging and status tracking
   - Fallback to mock mode when credentials missing

2. **Frontend Integration** (`src/pages/Home.tsx`)
   - Automatic location detection
   - User information passing
   - Enhanced emergency overlay with real-time status

3. **API Endpoints** (`api/index.py`)
   - `/api/sos/trigger` - Enhanced with location/user data
   - `/api/health` - Service status monitoring

---

## 🔧 What You Need to Do

### Step 1: Create Twilio Account
1. Go to [Twilio Console](https://console.twilio.com/)
2. Sign up for a free account (requires phone verification)
3. Complete the registration process

### Step 2: Get Your Credentials
In the Twilio Console, find:
- **Account SID** - Unique identifier for your account
- **Auth Token** - Secret token for API authentication
- **Phone Number** - Your Twilio phone number (purchased in next step)

### Step 3: Purchase a Phone Number
1. In Twilio Console, go to **Phone Numbers** → **Manage** → **Buy a number**
2. Search for and purchase a phone number in your country
3. Note this number (format: +1234567890)

### Step 4: Configure Environment Variables
Open the `.env` file in your project root and replace the placeholder values:

```env
# Replace these with your actual Twilio credentials
TWILIO_ACCOUNT_SID=ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_PHONE_NUMBER=+1234567890
```

### Step 5: Add Emergency Contacts
1. Log into your KIDDOO app
2. Go to **Profile Page**
3. Add emergency contacts with:
   - Full name
   - Valid phone number (international format: +1234567890)

---

## 📱 How It Works

### Manual SOS Trigger
1. User clicks the SOS button in the chat interface
2. Browser requests location permission
3. System sends SMS to all emergency contacts with:
   ```
   🚨 EMERGENCY ALERT - KIDDOO MENTAL HEALTH SOS 🚨

   User: John Doe
   Time: 2024-01-31 14:30:25
   Location: 40.7128, -74.0060 | Map: https://maps.google.com/?q=40.7128,-74.0060

   This is an automated critical mental health emergency alert. 
   The user has triggered an SOS. Please check on them immediately.

   User ID: abc123...
   ```

### Autonomous SOS (Critical Distress Detection)
1. System detects critical keywords in user message
2. Automatically triggers SOS without manual intervention
3. Sends alerts to emergency contacts
4. Displays emergency overlay to user

---

## 🔍 Testing Your Setup

### Method 1: Health Check Endpoint
```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{
  "status": "healthy",
  "services": {
    "analysis_service": true,
    "sos_service": true,
    "twilio_configured": true
  }
}
```

### Method 2: Test SOS Trigger
Use the frontend app:
1. Start both frontend (`npm run dev`) and backend (`python api/index.py`)
2. Log in to the app
3. Add emergency contacts in Profile
4. Click the SOS button in chat
5. Check your phone for SMS

### Method 3: Backend Direct Test
```bash
curl -X POST http://localhost:5000/api/sos/trigger \
  -H "Content-Type: application/json" \
  -d '{
    "emergency_contacts": [
      {"name": "Test Contact", "phone": "+1234567890"}
    ],
    "user_location": {"lat": 40.7128, "lng": -74.0060},
    "user_info": {"name": "Test User", "uid": "test123"}
  }'
```

---

## ⚠️ Important Notes

### SMS Limitations
- **Free Trial Accounts**: Limited to verified numbers only
- **Upgrade Required**: For sending to any phone number
- **Cost**: ~$0.0075 per SMS (varies by country)

### Privacy & Compliance
- Only send alerts with explicit user consent
- Store minimal user data
- Comply with local privacy laws (GDPR, CCPA, etc.)

### Error Handling
The system gracefully degrades:
- If Twilio credentials missing → Uses mock mode
- If location denied → Sends alert without location
- If SMS fails → Logs error and continues

---

## 🛠 Troubleshooting

### Issue: "Twilio not configured"
**Solution**: Check that all three environment variables are set correctly in `.env`

### Issue: "SMS failed to send"
**Check**:
1. Phone numbers are in international format (+1234567890)
2. Twilio account has sufficient balance
3. Numbers are verified (for trial accounts)

### Issue: Location not detected
**Solution**: 
- Ensure browser location permissions are granted
- Check browser settings for location access
- Test with HTTPS (location API requires secure context)

### Issue: Backend won't start
**Check**:
1. Python dependencies installed: `pip install -r api/requirements.txt`
2. NLTK data downloaded: Run `python -m nltk.downloader stopwords punkt`
3. Port 5000 is not in use

---

## 📞 Support Resources

- [Twilio Documentation](https://www.twilio.com/docs)
- [Twilio SMS API](https://www.twilio.com/docs/sms)
- [Twilio Pricing](https://www.twilio.com/pricing)

---

## ✅ Checklist

Before going live, ensure:

- [ ] Twilio account created and verified
- [ ] Phone number purchased
- [ ] Environment variables configured
- [ ] Emergency contacts added in app
- [ ] Test SMS sent successfully
- [ ] Location detection working
- [ ] Backend health check passes
- [ ] Privacy policy updated (if required)

---

**Ready to proceed? Follow the steps above and let me know when you have your Twilio credentials!**
