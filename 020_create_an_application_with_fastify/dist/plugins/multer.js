"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatePhotoFilename = void 0;
const fastify_plugin_1 = __importDefault(require("fastify-plugin"));
const fastify_multer_1 = __importDefault(require("fastify-multer"));
const mime_1 = __importDefault(require("mime"));
const node_crypto_1 = require("node:crypto");
const generatePhotoFilename = (mimeType) => {
    const randomFilename = `${(0, node_crypto_1.randomUUID)()}- ${Date.now()}`;
    const fileExtension = mime_1.default.getExtension(mimeType);
    const filename = `${randomFilename}.${fileExtension}`;
    return filename;
};
exports.generatePhotoFilename = generatePhotoFilename;
const storage = fastify_multer_1.default.diskStorage({
    destination: "upload/",
    filename: (request, file, callback) => {
        return callback(null, (0, exports.generatePhotoFilename)(file.mimetype));
    }
});
const VALID_MIME_TYPES = ["image/png", "image/jpeg"];
const MAX_SIZE_IN_MEGABYTES = 6 * 1024 * 1024;
const upload = (0, fastify_multer_1.default)({
    storage, fileFilter: (request, file, callback) => {
        if (VALID_MIME_TYPES.includes(file.mimetype)) {
            callback(null, true);
        }
        else {
            callback(new Error("The uploaded file must be a JPG or PNG imae."));
        }
    }, limits: {
        fileSize: MAX_SIZE_IN_MEGABYTES
    }
});
const multerPlugin = (app, options, done) => {
    app.register(fastify_multer_1.default.contentParser);
    app.decorate("upload", upload);
    done();
};
exports.default = (0, fastify_plugin_1.default)(multerPlugin);
//# sourceMappingURL=multer.js.map