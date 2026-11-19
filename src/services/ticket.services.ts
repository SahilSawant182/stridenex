import { apiService } from "./api.services";

export interface TicketAttachment {
  file_name: string;
  file_url: string;
  file_size?: number;
  uploaded_at?: string;
}

export interface TicketSummary {
  ticket_id: string;
  subject: string;
  status: "Open" | "Replied" | "In Progress" | "Resolved" | "Closed" | string;
  priority: "Low" | "Medium" | "High" | "Urgent" | string;
  creation: string;
  modified?: string;
}

export interface TicketComment {
  comment_id: string;
  comment_by: string;
  message: string;
  created_at: string;
  is_user: boolean;
  attachments?: TicketAttachment[];
}

export interface TicketDetail {
  ticket_id: string;
  subject: string;
  description: string;
  status: "Open" | "Replied" | "In Progress" | "Resolved" | "Closed" | string;
  priority: "Low" | "Medium" | "High" | "Urgent" | string;
  created_at: string;
  attachments?: TicketAttachment[];
  comments: TicketComment[];
}

export interface CreateTicketPayload {
  subject: string;
  description: string;
  priority?: "Low" | "Medium" | "High" | "Urgent" | string;
  attachments?: File[] | File;
}

export interface AddCommentPayload {
  ticket_id: string;
  message: string;
  attachments?: File[] | File;
}

export const ticketService = {
  // 1. Create Support Ticket (multipart/form-data supported)
  createTicket: async (payload: CreateTicketPayload) => {
    const formData = new FormData();
    formData.append("subject", payload.subject.trim());
    formData.append("description", payload.description.trim());
    formData.append("priority", payload.priority || "Low");

    if (payload.attachments) {
      const files = Array.isArray(payload.attachments) ? payload.attachments : [payload.attachments];
      files.forEach((file, index) => {
        if (index === 0) {
          formData.append("file", file);
        }
        formData.append("attachments", file);
      });
    }

    const response = await apiService.post(
      "method/stridenex_app.api_stridenex_app.ticket.create_ticket",
      formData
    );
    return response;
  },

  // 2. Get My Raised Tickets (List View)
  getMyTickets: async () => {
    const response = await apiService.get(
      "method/stridenex_app.api_stridenex_app.ticket.get_my_tickets"
    );
    return response;
  },

  // 3. Get Ticket Details & Conversation (Chat View)
  getTicketDetails: async (ticketId: string) => {
    try {
      const response = await apiService.post(
        "method/stridenex_app.api_stridenex_app.ticket.get_ticket_details",
        {
          ticket_id: String(ticketId),
        }
      );
      return response;
    } catch {
      // Fallback to GET with query param if endpoint expects GET
      const fallback = await apiService.get(
        `method/stridenex_app.api_stridenex_app.ticket.get_ticket_details?ticket_id=${encodeURIComponent(ticketId)}`
      );
      return fallback;
    }
  },

  // 4. Reply to Ticket / Add Comment (ALWAYS multipart/form-data via FormData)
  addTicketComment: async (payload: AddCommentPayload) => {
    const formData = new FormData();
    formData.append("ticket_id", String(payload.ticket_id));
    formData.append("message", payload.message.trim());

    if (payload.attachments) {
      const files = Array.isArray(payload.attachments) ? payload.attachments : [payload.attachments];
      files.forEach((file, index) => {
        if (index === 0) {
          formData.append("file", file);
        }
        formData.append("attachments", file);
      });
    }

    const response = await apiService.post(
      "method/stridenex_app.api_stridenex_app.ticket.add_ticket_comment",
      formData
    );
    return response;
  },
};
