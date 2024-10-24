import axios from "axios";

export const getBookDetail = async (req, res) => {
  const { id } = req.params;
  const apiKey = process.env.API_KEY;
  try {
    const response = await axios.get(
      `https://www.googleapis.com/books/v1/volumes/${id}?key=${apiKey}`,
    );
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching book details:", error);
    res.status(500).json({ error: "Failed to fetch book details" });
  }
};
