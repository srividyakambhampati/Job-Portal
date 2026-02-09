const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, path.join(__dirname, '../uploads/'));
    },
    filename(req, file, cb) {
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    },
});

const checkFileType = (file, cb) => {
    // Allow extensions
    const filetypes = /pdf|doc|docx/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    // Allow mimetypes (be more lenient as browsers might send different ones for MS Word)
    const mimetypes = /pdf|msword|vnd.openxmlformats-officedocument.wordprocessingml.document/;
    const mimetype = mimetypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb('Error: Resumes only! (pdf, doc, docx)');
    }
};

const upload = multer({
    storage,
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    },
});

module.exports = upload;
