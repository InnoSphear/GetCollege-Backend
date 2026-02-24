import ContactInfo from "../models/contactInfo.model.js";

export const createContactInfo = async (req, res) => {
  try {
    const contact = await ContactInfo.create(req.body);
    return res.status(201).json({ success: true, data: contact });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllContactInfo = async (req, res) => {
  try {
    const contacts = await ContactInfo.find().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, count: contacts.length, data: contacts });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getContactInfoById = async (req, res) => {
  try {
    const contact = await ContactInfo.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({ success: false, message: "Contact info not found" });
    }
    return res.status(200).json({ success: true, data: contact });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateContactInfo = async (req, res) => {
  try {
    const contact = await ContactInfo.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!contact) {
      return res.status(404).json({ success: false, message: "Contact info not found" });
    }
    return res.status(200).json({ success: true, data: contact });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteContactInfo = async (req, res) => {
  try {
    const contact = await ContactInfo.findByIdAndDelete(req.params.id);
    if (!contact) {
      return res.status(404).json({ success: false, message: "Contact info not found" });
    }
    return res.status(200).json({ success: true, message: "Contact info deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
