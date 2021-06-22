//Multer permet de gérer les fichiers (ici les images récupérées via le formulaire)


const multer = require('multer');

const MIME_TYPES = { 
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'images');
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(' ').join('_'); //On supprime les éventuels espaces dans le nom du fichier et on les remplace par _
    const extension = MIME_TYPES[file.mimetype]; //On crée la bonne extension au fichier .jpg/.png
    callback(null, name + Date.now() + '.' + extension); 
    /*On assemble les différents éléments pour créer un nom de fichier unique, 
    on y ajoute la date précise de sorte que chaque fichier image ait un nom unique*/
  }
});

module.exports = multer({storage: storage}).single('image');