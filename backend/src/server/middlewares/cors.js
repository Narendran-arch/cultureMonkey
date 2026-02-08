import { defineEventHandler, setHeader } from "h3";

export default defineEventHandler((event) => {
  setHeader(event, "Access-Control-Allow-Origin", "http://localhost:5173");
  setHeader(
    event,
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,PATCH,DELETE,OPTIONS",
  );
  setHeader(event, "Access-Control-Allow-Headers", "Content-Type");

  // Preflight
  if (event.method === "OPTIONS") {
    return "";
  }
});
