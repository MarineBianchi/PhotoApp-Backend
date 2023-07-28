var express = require('express');
var router = express.Router();

// module utilisé pour générer des identifiants uniques utilisés pour nommer les fichiers temporaires stockés localement avant de les télécharger sur Cloudinary
const uniqid = require('uniqid');

//Importe le module cloudinary qui fournit une API pour interagir avec Cloudinary
const cloudinary = require('cloudinary').v2;

// Importe le module fs (File System) de Node pour travailler avec le système de fichiers local
const fs = require('fs');

// gérer une route qui permet de télécharger des photos, les stocker temporairement, les télécharger sur Cloudinary puis renvoyer l'URL de l'image téléchargée
router.post('/upload', async (req, res) => {

  // Génère un nom de fichier unique et crée un chemin de fichier photoPath dans le répertoire './tmp/', stocke temporairement l'image téléchargée localement avant de la télécharger sur Cloudinary
 const photoPath = `./tmp/${uniqid()}.jpg`;

 // Opération asynchrone pour déplacer l'image téléchargée depuis le front vers le chemin photoPath
 const resultMove = await req.files.photoFromFront.mv(photoPath);

// vérifie si le déplacement a réussi  
 if (!resultMove) {
     const resultCloudinary = await cloudinary.uploader.upload(photoPath);
     fs.unlinkSync(photoPath);
 
   res.json({ result: true, url: resultCloudinary.secure_url }); 
 } else {
   res.json({ result: false, error: resultMove });
 }
});


module.exports = router;
