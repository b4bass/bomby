
// Constantes du jeu
var NBR_LIGNES = 5;
var NBR_BRIQUES_PAR_LIGNE = 8;
var BRIQUE_WIDTH = 48;
var BRIQUE_HEIGHT = 15;
var ESPACE_BRIQUE = 2;
var BARRE_JEU_WIDTH = 80; // Largeur de la barre de jeu
var BARRE_JEU_HEIGHT = 10; // Heuteur de la barre de jeu

//constantes couleurs
COULEURS_BRIQUES = ["#503A22", "#88502F", "#A17048", "#D9C38A", "#F7DDAC"];

//Constantes pour les deplacements
var PXL_DEPLA = 4;
var ZONE_JEU_WIDTH = 400;
var ZONE_JEU_HEIGHT = 300;

//Constantes de la balle
var COULEUR_BALLE = "#16A6DB"
var DIMENSION_BALLE = 8;
var VITESSE_BALLE = 1;

// Variables
var tabBriques; // Tableau virtuel contenant les briques
var barreX; // Position en X de la barre: Changement dynamique avec clavier / souris
var barreY; // Position en Y de la barre: Ne bougera pas.
var context;

// Variables de la balle
var balleX = 100;
var balleY = 250;
var dirBalleX = 1;
var dirBalleY = -1;
var boucleJeu;

// Variable win / lose temoin
var aGagne = 0;

// Variable qui determine si la balle se trouve dans la zone de colision avec les briques
var limiteBriques = (ESPACE_BRIQUE+BRIQUE_HEIGHT)*NBR_LIGNES;

window.addEventListener('load', function () {
    // On récupère l'objet canvas
    var elem = document.getElementById('canvasElem');
    if (!elem || !elem.getContext) {
	return;
    }
    
    // On récupère le contexte 2D
    context = elem.getContext('2d');
    if (!context) {
	return;
    }
    
    barreX = (elem.width/2)-(BARRE_JEU_WIDTH/2); // On calcule le centre du jeu
    barreY = (elem.height-BARRE_JEU_HEIGHT); // On calcule la position la plus basse pour la barre
  
  // Le navigateur est compatible, on peut continuer: On initialise le jeu.
    creerBriques(context, NBR_LIGNES, NBR_BRIQUES_PAR_LIGNE, BRIQUE_WIDTH, BRIQUE_HEIGHT, ESPACE_BRIQUE);
    context.fillStyle = "#333333"; // On attribue la couleur de la barre
    context.fillRect(barreX,barreY,BARRE_JEU_WIDTH,BARRE_JEU_HEIGHT); // On positionne la barre    

    //On appel la fonction qui va refresh l'affichage du jeu tous les 10ms
    boucleJeu = setInterval(refreshGame, 10);

    //On appel la fonction CheckDepla qui va chercher les keyboard events
    window.document.onkeydown = checkDepla;

}, false);

    // Fonction permettant de créer les briques du jeu
function creerBriques(ctx, nbrLignes, nbrParLigne, largeur, hauteur, espace) {
    
    // Tableau virtuel: On initialise les lignes de briques
    tabBriques = new Array(nbrLignes);
    
    for (var i=0; i < nbrLignes; i++) {
	
	// Tableau virtuel: On initialise les briques de la ligne
	tabBriques[i] = new Array(nbrParLigne);
	
	// Affichage: On attribue une couleur aux briques de la ligne
	ctx.fillStyle = COULEURS_BRIQUES[i];
	
	for (var j=0; j < nbrParLigne; j++) {
	    
	    // Affichage: On affiche une nouvelle brique
	    ctx.fillRect((j*(largeur+espace)),(i*(hauteur+espace)),largeur,hauteur);
	    
	    // Tableau virtuel: On attribue à la case actuelle la valeur 1 = Une brique existe encore
	    tabBriques[i][j] = 1;
	    
	}
    }
    // Nos briques sont initialisées.
    return 1;
}

function refreshGame() {

    // On efface la zone
    clearContexte(context, 0, ZONE_JEU_WIDTH, 0, ZONE_JEU_HEIGHT);

    // On initialise la var temoin a 1 pour la gagne
    aGagne = 1;

    // Réaffichage des briques dont l'état = 1
    for (var i=0; i < tabBriques.length; i++) {
	context.fillStyle = COULEURS_BRIQUES[i];
	for (var j=0; j < tabBriques[i].length; j++) {
	    if (tabBriques[i][j] == 1) {
		context.fillRect((j*(BRIQUE_WIDTH+ESPACE_BRIQUE)),(i*(BRIQUE_HEIGHT+ESPACE_BRIQUE)),BRIQUE_WIDTH,BRIQUE_HEIGHT);
		aGagne = 0; // Le joueur n'a pas gagné, il reste toujours au moins une brique
	    }
	}
    }

    // On vérifie si le joueur à gagné
    if ( aGagne ) gagne();


    // Affichage de la barre de jeu
    context.fillStyle = "#333333";
    context.fillRect(barreX,barreY,BARRE_JEU_WIDTH,BARRE_JEU_HEIGHT);

    // Affichage de la balle et couleurs
    context.fillStyle = COULEUR_BALLE;
    context.beginPath();
    context.arc(balleX, balleY, DIMENSION_BALLE, 0, Math.PI*2, true);
    context.closePath();
    context.fill();


    // Calcul de la nouvelle position de la balle    
    if ( (balleX + dirBalleX * VITESSE_BALLE) >  ZONE_JEU_WIDTH) dirBalleX = -1;
    else if ( (balleX + dirBalleX * VITESSE_BALLE) <  0) dirBalleX = 1;
    if ( (balleY + dirBalleY * VITESSE_BALLE) >  ZONE_JEU_HEIGHT) perdu();
    else {
	if ( (balleY + dirBalleY * VITESSE_BALLE) <  0) dirBalleY = 1;
	else {
	    if ( ((balleY + dirBalleY * VITESSE_BALLE) > (ZONE_JEU_HEIGHT - BARRE_JEU_HEIGHT)) && ((balleX + dirBalleX * VITESSE_BALLE) >= barreX) && ((balleX + dirBalleX * VITESSE_BALLE) <= (barreX+BARRE_JEU_WIDTH))) {
		dirBalleY = -1;
		dirBalleX = 2*(balleX-(barreX+BARRE_JEU_WIDTH/2))/BARRE_JEU_WIDTH;
	    }
	}
    }

    // On fait avancer la balle
    balleX += dirBalleX * VITESSE_BALLE;
    balleY += dirBalleY * VITESSE_BALLE;


// Test des collisions avec les briques
    if ( balleY <= limiteBriques) {
	// On est dans la zone des briques
	var ligneY = Math.floor(balleY/(BRIQUE_HEIGHT+ESPACE_BRIQUE));
	var ligneX = Math.floor(balleX/(BRIQUE_WIDTH+ESPACE_BRIQUE));
	if ( tabBriques[ligneY][ligneX] == 1 ) {
	    tabBriques[ligneY][ligneX] = 0;
	    dirBalleY = 1;
	}
    }

}

function clearContexte(ctx, startwidth, ctxwidth, startheight, ctxheight) {
    ctx.clearRect(startwidth, startheight, ctxwidth, ctxheight);
}

function checkDepla(e) {
    // Flêche de droite préssée
    if (e.keyCode == 39) {
	if ( (barreX+PXL_DEPLA+BARRE_JEU_WIDTH) <= ZONE_JEU_WIDTH ) barreX += PXL_DEPLA;
    }
    // Flêche de gauche préssée
    else if (e.keyCode == 37) {
	if ( ((barreX-PXL_DEPLA)) >= 0 )  barreX -= PXL_DEPLA;
    }
}


function perdu() {
    clearInterval(boucleJeu);
    alert("Perdu !");
}

function gagne() {
    clearInterval(boucleJeu);
    alert("Bravo vous avez gagné !");
}