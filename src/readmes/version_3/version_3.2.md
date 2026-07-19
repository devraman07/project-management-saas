## attachments

id
taskId
membershipId
fileName
originalName
mimeType
fileSize
storageKey
url
createdAt
deletedAt

POST /tasks/:taskId/attachments
GET /tasks/:taskId/attachments
DELETE /tasks/:taskId/attachments/:attachmentId

attachments/

    attachment.routes.js

    attachment.controller.js

    attachment.service.js

    attachment.repository.js

    attachment.validation.js

    attachment.transformer.js

ATTACHMENT_UPLOADED

ATTACHMENT_DELETED

{
"taskId": "...",
"fileName": "requirements.pdf"
} metadata

V3.2 Attachments

 Database Schema = done
 Repository = done
 Cloudinary config

 Multer middleware = done

 Multer error middleware = done

 deleteLocalFile() = done

 uploadFileToCloudinary() = done
 Upload Service = done
 Upload Controller = done 
 Upload Route = done
 GET Attachments = done
 DELETE Attachment = done
 Activity Logging = done
 Testing = done

---

Refactor

⬜ Add proper relations to every schema
⬜ Cleanup imports
⬜ Verify migrations

BullMQ → RabbitMQ
BullMQ → Kafka
Queue → Direct database write
