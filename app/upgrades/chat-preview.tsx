export function ChatPreview() {
  return (
    <div className="chat-preview" aria-label="Example website chatbot conversation">
      <div className="chat-row from-visitor">
        <small>Visitor</small>
        Do you take Saturday jobs?
      </div>
      <div className="chat-row from-bot">
        <small>Site assistant</small>
        Yes—Saturday appointments are available. I can collect the job details and send them to Cody.
      </div>
      <div className="chat-row from-visitor">
        <small>Visitor</small>
        What does a basic website cost?
      </div>
      <div className="chat-row from-bot">
        <small>Site assistant</small>
        A basic 3–5 page site starts at $750. I can take your name and number so Cody can follow up.
      </div>
    </div>
  );
}
