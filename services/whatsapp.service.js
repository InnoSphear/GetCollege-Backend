import axios from "axios";

const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
const WHATSAPP_PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;
const WHATSAPP_TO = process.env.WHATSAPP_TO || "918595602699";

export const sendWhatsAppMessage = async (message) => {
  if (!WHATSAPP_TOKEN || !WHATSAPP_PHONE_NUMBER_ID) {
    console.log("WhatsApp credentials not configured. Message would be:", message);
    return { success: false, reason: "not_configured" };
  }

  try {
    const response = await axios.post(
      `https://graph.facebook.com/v21.0/${WHATSAPP_PHONE_NUMBER_ID}/messages`,
      {
        messaging_product: "whatsapp",
        to: WHATSAPP_TO,
        type: "text",
        text: { body: message },
      },
      {
        headers: {
          Authorization: `Bearer ${WHATSAPP_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("WhatsApp message sent successfully");
    return { success: true, data: response.data };
  } catch (error) {
    console.error("WhatsApp send error:", error.response?.data || error.message);
    return { success: false, error: error.response?.data || error.message };
  }
};

export const sendLeadNotification = async (lead) => {
  const message = [
    "*New Lead Registration*",
    "",
    `*Name:* ${lead.name || "N/A"}`,
    `*Phone:* ${lead.mobile || "N/A"}`,
    `*Email:* ${lead.email || "N/A"}`,
    `*Course:* ${lead.course || "N/A"}`,
    `*State:* ${lead.state || "N/A"}`,
    `*Mode:* ${lead.preferredMode || "N/A"}`,
    `*Source:* ${lead.source || "Website"}`,
    `*Time:* ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}`,
  ].join("\n");

  return sendWhatsAppMessage(message);
};
