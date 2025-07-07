import React, { useState, useEffect } from 'react';
import { auth, db } from './services/firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  signInAnonymously,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import FirebaseTest from './components/FirebaseTest';

// ===================================================================================
// --- 2. DONNÉES DE L'APPLICATION ---
// ===================================================================================
// Les données textuelles sont gardées ici pour une modification facile.
const timelineData = [
  {
    id: 'desir',
    title: "Désir d'Enfant",
    icon: 'ph-heart',
    content: `<h3 class="text-2xl font-bold text-slate-900 mb-4">Le Projet à Deux : Le Désir d'Enfant</h3><p class="mb-4">Cette phase est celle des fondations. C'est le moment de discuter ouvertement, de rêver ensemble, mais aussi d'être pragmatique. Votre rôle est d'être un partenaire à part entière dans la réflexion.</p><div><h4 class="font-semibold text-lg mb-2">Points Clés :</h4><ul class="list-disc list-inside space-y-2 text-slate-700"><li><strong>La Communication :</strong> C'est le pilier. Discutez de vos visions de la parentalité, de vos peurs, de vos attentes.</li><li><strong>La Santé :</strong> Encouragez un bilan de santé pour vous deux. Adoptez un mode de vie plus sain.</li><li><strong>L'Aspect Financier :</strong> Parlez budget. Anticiper les coûts permet de vivre la suite plus sereinement.</li><li><strong>La Patience :</strong> La conception peut prendre du temps. Restez une équipe soudée.</li></ul></div>`,
  },
  {
    id: 'trimestre1',
    title: '1er Trimestre',
    icon: 'ph-hourglass-simple-medium',
    content: `<h3 class="text-2xl font-bold text-slate-900 mb-4">Le Choc et le Secret : 1er Trimestre (0-14 semaines)</h3><p class="mb-4">Ça y est, le test est positif. C'est le temps des secrets partagés et des premiers grands changements.</p><div><h4 class="font-semibold text-lg mb-2">Votre Rôle de Pilier :</h4><ul class="list-disc list-inside space-y-2 text-slate-700"><li><strong>Soutien face aux maux :</strong> Fatigue, nausées... Prenez le relais sur les tâches, assurez-vous qu'elle puisse se reposer.</li><li><strong>Présence aux rendez-vous :</strong> La première échographie est un moment fondateur. Votre présence est essentielle.</li><li><strong>Le gardien du secret :</strong> Respectez son choix sur le moment de l'annonce.</li><li><strong>L'écoute active :</strong> Elle vit une révolution hormonale. Écoutez et rassurez sans juger.</li></ul></div>`,
  },
  {
    id: 'trimestre2',
    title: '2ème Trimestre',
    icon: 'ph-hand-pointing',
    content: `<h3 class="text-2xl font-bold text-slate-900 mb-4">La Connexion : 2ème Trimestre (15-28 semaines)</h3><p class="mb-4">Le ventre s'arrondit, la grossesse devient concrète. C'est le moment de construire le lien avec votre bébé.</p><div><h4 class="font-semibold text-lg mb-2">Construire le Lien :</h4><ul class="list-disc list-inside space-y-2 text-slate-700"><li><strong>Sentez-le bouger :</strong> Posez la main sur son ventre, parlez à votre bébé. Il reconnaît votre voix.</li><li><strong>Participez aux projets :</strong> Choix du prénom, aménagement de la chambre... Impliquez-vous !</li><li><strong>Planifiez l'avenir :</strong> Renseignez-vous sur les modes de garde, les démarches administratives.</li><li><strong>Prenez soin de votre couple :</strong> Profitez de cette période d'accalmie pour vous retrouver.</li></ul></div>`,
  },
  {
    id: 'trimestre3',
    title: '3ème Trimestre',
    icon: 'ph-package',
    content: `<h3 class="text-2xl font-bold text-slate-900 mb-4">La Ligne Droite : 3ème Trimestre (29-40+ semaines)</h3><p class="mb-4">La fin approche. Votre rôle de soutien logistique et émotionnel est à son paroxysme.</p><div><h4 class="font-semibold text-lg mb-2">Le Préparateur en Chef :</h4><ul class="list-disc list-inside space-y-2 text-slate-700"><li><strong>Préparez-vous à l'accouchement :</strong> Participez aux cours de préparation. Comprenez votre rôle.</li><li><strong>Logistique :</strong> Valise de maternité, siège auto, itinéraire... Avoir tout sous contrôle la rassurera.</li><li><strong>Le soutien physique :</strong> Massez-lui le dos, aidez-la, soyez patient.</li><li><strong>Gérez les angoisses :</strong> Parlez de l'accouchement, de vos peurs. Formez une équipe.</li></ul></div>`,
  },
  {
    id: 'accouchement',
    title: 'Accouchement',
    icon: 'ph-flag-checkered',
    content: `<h3 class="text-2xl font-bold text-slate-900 mb-4">Le Jour J : L'Accouchement</h3><p class="mb-4">Vous êtes son coach, son avocat, son ancre. C'est l'un des jours les plus intenses de votre vie.</p><div><h4 class="font-semibold text-lg mb-2">Votre Mission :</h4><ul class="list-disc list-inside space-y-2 text-slate-700"><li><strong>Le Gardien du Temple :</strong> Gérez les communications, créez une bulle de sérénité.</li><li><strong>Le Porte-Parole :</strong> Soyez le lien avec l'équipe médicale, rappelez ses souhaits.</li><li><strong>Le Soutien Inconditionnel :</strong> Aidez-la à gérer la douleur, encouragez-la.</li><li><strong>Accueillez votre enfant :</strong> Le peau à peau est un premier contact magique et rassurant.</li></ul></div>`,
  },
  {
    id: 'retour-maison',
    title: 'Retour à la Maison',
    icon: 'ph-house-line',
    content: `<h3 class="text-2xl font-bold text-slate-900 mb-4">La Nouvelle Vie : Le Retour à la Maison</h3><p class="mb-4">Le "quatrième trimestre". Bonheur immense et chaos. Le mot d'ordre : travail d'équipe.</p><div><h4 class="font-semibold text-lg mb-2">Le Co-Parent :</h4><ul class="list-disc list-inside space-y-2 text-slate-700"><li><strong>Le Gérant de l'Intendance :</strong> Prenez en charge les repas, courses, ménage.</li><li><strong>Le Relais Nocturne :</strong> Levez-vous, changez la couche, soutenez-la.</li><li><strong>Le Protecteur de la Mère :</strong> Soyez attentif au baby-blues. Valorisez-la.</li><li><strong>Créez votre lien :</strong> Changez, donnez le bain, portez votre bébé. Vous êtes le père.</li></ul></div>`,
  },
  {
    id: 'premieres-annees',
    title: 'Premières Années',
    icon: 'ph-person-simple-walk',
    content: `<h3 class="text-2xl font-bold text-slate-900 mb-4">Le Père qui Grandit : Les Premières Années</h3><p class="mb-4">Le bébé devient un enfant. Votre rôle évolue. C'est le temps du jeu, de l'éducation, de la transmission.</p><div><h4 class="font-semibold text-lg mb-2">Le Guide et le Partenaire :</h4><ul class="list-disc list-inside space-y-2 text-slate-700"><li><strong>Le Partenaire de Jeu :</strong> Le jeu est le langage de l'enfant. Roulez par terre, lisez des histoires.</li><li><strong>Le Cadre Éducatif :</strong> Soyez cohérents sur les règles et les valeurs.</li><li><strong>L'Amoureux :</strong> Ne vous oubliez pas en tant que couple. Un couple solide est un cadeau.</li><li><strong>L'Homme :</strong> Prenez du temps pour vous. Un père épanoui est un meilleur père.</li></ul></div>`,
  },
];

// ===================================================================================
// --- 3. SERVICES (Logique métier séparée de l'affichage) ---
// ===================================================================================
// Définir appId en dur ou via variable d'environnement
const appId = import.meta.env.VITE_APP_ID || 'aide-paternite';

const firestoreService = {
  getUserData: async (userId) => {
    if (!userId) return null;
    const userDocRef = doc(db, `artifacts/${appId}/users/${userId}/profile`, 'data');
    const docSnap = await getDoc(userDocRef);
    return docSnap.exists() ? docSnap.data() : null;
  },
  saveUserData: async (userId, data) => {
    if (!userId) return;
    const userDocRef = doc(db, `artifacts/${appId}/users/${userId}/profile`, 'data');
    await setDoc(userDocRef, data, { merge: true });
  },
  saveNoteForStage: async (userId, stageId, note) => {
    if (!userId || !stageId) return;
    const noteDocRef = doc(db, `artifacts/${appId}/users/${userId}/notes`, stageId);
    await setDoc(noteDocRef, { content: note, lastUpdated: new Date() });
  },
  loadNoteForStage: async (userId, stageId) => {
    if (!userId || !stageId) return '';
    const noteDocRef = doc(db, `artifacts/${appId}/users/${userId}/notes`, stageId);
    const docSnap = await getDoc(noteDocRef);
    return docSnap.exists() ? docSnap.data().content : '';
  },
};

// ===================================================================================
// --- 4. COMPOSANTS UI (Petits morceaux d'interface réutilisables) ---
// ===================================================================================

const Header = ({ user, onLoginClick, onLogoutClick }) => (
  <header className="bg-white shadow-md sticky top-0 z-40">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
      <div className="flex items-center space-x-3">
        <i className="ph-bold ph-baby text-4xl text-slate-800"></i>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Aide à la Paternité</h1>
          <p className="text-sm text-slate-600">
            {user
              ? `Bienvenue, ${user.name || 'futur papa'} !`
              : 'Le guide pour futurs et nouveaux pères.'}
          </p>
        </div>
      </div>
      <div>
        {user ? (
          <button
            onClick={onLogoutClick}
            className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-500 transition-colors"
          >
            Déconnexion
          </button>
        ) : (
          <button
            onClick={onLoginClick}
            className="bg-slate-800 text-white px-4 py-2 rounded-lg font-semibold hover:bg-slate-700 transition-colors"
          >
            Connexion
          </button>
        )}
      </div>
    </div>
  </header>
);

const AuthModal = ({ isOpen, onClose, showToast }) => {
  const [isLoginView, setIsLoginView] = useState(true);

  const handleAuth = async (e, authAction) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    const name = e.target.name?.value;

    try {
      if (authAction === 'signup') {
        if (password.length < 6) {
          showToast('Le mot de passe doit faire au moins 6 caractères.', 'error');
          return;
        }
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await firestoreService.saveUserData(userCredential.user.uid, {
          name,
          email,
          createdAt: new Date(),
        });
        showToast('Compte créé avec succès !');
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        showToast('Connexion réussie !');
      }
      onClose();
    } catch (error) {
      console.error('Auth error:', error);
      showToast("Erreur d'authentification. Vérifiez vos identifiants.", 'error');
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-500 hover:text-slate-800"
        >
          <i className="ph-bold ph-x text-2xl"></i>
        </button>
        {isLoginView ? (
          <div>
            <h2 className="text-2xl font-bold text-center mb-1">Bon retour !</h2>
            <p className="text-center text-slate-600 mb-6">
              Connectez-vous pour retrouver votre parcours.
            </p>
            <form onSubmit={(e) => handleAuth(e, 'login')}>
              <div className="mb-4">
                <label
                  htmlFor="login-email"
                  className="block text-sm font-medium text-slate-700 mb-1"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="login-email"
                  name="email"
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500"
                />
              </div>
              <div className="mb-6">
                <label htmlFor="login-password">Mot de passe</label>
                <input
                  type="password"
                  id="login-password"
                  name="password"
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-slate-800 text-white py-3 rounded-lg font-semibold hover:bg-slate-700 transition-colors"
              >
                Connexion
              </button>
            </form>
            <p className="text-center text-sm mt-4">
              Pas de compte ?{' '}
              <button
                onClick={() => setIsLoginView(false)}
                className="font-semibold text-slate-600 hover:underline"
              >
                Inscrivez-vous
              </button>
            </p>
          </div>
        ) : (
          <div>
            <h2 className="text-2xl font-bold text-center mb-1">Créez votre espace</h2>
            <p className="text-center text-slate-600 mb-6">
              Rejoignez-nous pour commencer l'aventure.
            </p>
            <form onSubmit={(e) => handleAuth(e, 'signup')}>
              <div className="mb-4">
                <label htmlFor="signup-name">Votre prénom</label>
                <input
                  type="text"
                  id="signup-name"
                  name="name"
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="signup-email">Email</label>
                <input
                  type="email"
                  id="signup-email"
                  name="email"
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500"
                />
              </div>
              <div className="mb-6">
                <label htmlFor="signup-password">Mot de passe</label>
                <input
                  type="password"
                  id="signup-password"
                  name="password"
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-slate-800 text-white py-3 rounded-lg font-semibold hover:bg-slate-700 transition-colors"
              >
                Créer mon compte
              </button>
            </form>
            <p className="text-center text-sm mt-4">
              Déjà un compte ?{' '}
              <button
                onClick={() => setIsLoginView(true)}
                className="font-semibold text-slate-600 hover:underline"
              >
                Connectez-vous
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

const Toast = ({ message, type, isVisible }) => {
  if (!isVisible) return null;
  const bgColor = type === 'success' ? 'bg-slate-800' : 'bg-red-600';
  return (
    <div
      className={`fixed bottom-5 right-5 text-white px-6 py-3 rounded-lg shadow-lg transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'} ${bgColor}`}
    >
      <p>{message}</p>
    </div>
  );
};

const LoggedOutView = ({ onLoginClick }) => (
  <div className="text-center py-16 bg-white rounded-xl shadow-lg">
    <i className="ph-bold ph-lock text-6xl text-slate-400 mb-4"></i>
    <h2 className="text-2xl font-bold text-slate-800">Bienvenue sur votre espace personnel.</h2>
    <p className="text-slate-600 mt-2 max-w-xl mx-auto">
      Connectez-vous ou créez un compte pour suivre votre parcours, obtenir des conseils culinaires
      et bien plus.
    </p>
    <button
      onClick={onLoginClick}
      className="mt-6 bg-slate-800 text-white px-6 py-3 rounded-lg font-semibold hover:bg-slate-700 transition-colors"
    >
      Commencer mon parcours
    </button>
  </div>
);

const CuisineView = () => (
  <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg animate-fade-in">
    <h2 className="text-3xl font-bold text-slate-900 mb-2 text-center">
      Côté Cuisine : Le Guide du Partenaire
    </h2>
    <p className="text-slate-600 text-center mb-8 max-w-2xl mx-auto">
      Pendant la grossesse, l'alimentation est capitale. En prenant les rênes de la cuisine, vous
      soutenez activement votre compagne et votre futur bébé. C'est un acte d'amour au quotidien.
    </p>
    <div className="space-y-8">
      <div className="border border-slate-200 rounded-lg p-6">
        <h3 className="text-2xl font-bold mb-4">
          1er Trimestre : Lutter contre la fatigue et les nausées
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-lg mb-2">Aliments à privilégier :</h4>
            <ul className="list-disc list-inside space-y-1 text-slate-700">
              <li>Gingembre & Citron</li>
              <li>Légumes à feuilles vertes (riches en B9)</li>
              <li>Lentilles, pois chiches</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-lg mb-2 text-red-600">Points de vigilance :</h4>
            <ul className="list-disc list-inside space-y-1 text-red-500 text-sm">
              <li>Zéro alcool.</li>
              <li>Toxoplasmose : Viande bien cuite, laver fruits/légumes.</li>
              <li>Listériose : Éviter fromages au lait cru, charcuteries...</li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border border-slate-200 rounded-lg p-6">
        <h3 className="text-2xl font-bold mb-4">2ème Trimestre : Construire les réserves</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-lg mb-2">Aliments à privilégier :</h4>
            <ul className="list-disc list-inside space-y-1 text-slate-700">
              <li>Fer : Viande rouge, lentilles...</li>
              <li>Calcium : Produits laitiers, amandes...</li>
              <li>Oméga-3 : Petits poissons gras, noix...</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-lg mb-2">Idée Recette Facile :</h4>
            <p className="font-bold">Dahl de Lentilles Corail</p>
            <p className="text-sm text-slate-600">Plat complet, réconfortant et plein de fer.</p>
          </div>
        </div>
      </div>
      <div className="border border-slate-200 rounded-lg p-6">
        <h3 className="text-2xl font-bold mb-4">
          3ème Trimestre & Post-Partum : Faire le plein d'énergie
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-lg mb-2">Aliments à privilégier :</h4>
            <ul className="list-disc list-inside space-y-1 text-slate-700">
              <li>Sucres lents : Pâtes complètes, quinoa...</li>
              <li>Magnésium : Chocolat noir, bananes...</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-lg mb-2 text-blue-600">
              Action Clé : Le Batch Cooking du Papa !
            </h4>
            <p className="text-sm text-slate-600">
              Un mois avant le terme, préparez et congelez des plats. Votre "vous du futur" vous
              remerciera !
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const ParcoursView = ({ userId, showToast }) => {
  const [currentStageId, setCurrentStageId] = useState('desir');
  const [note, setNote] = useState('');
  const [isLoadingNote, setIsLoadingNote] = useState(true);

  const currentContent = timelineData.find((item) => item.id === currentStageId)?.content;

  useEffect(() => {
    const fetchNote = async () => {
      if (userId && currentStageId) {
        setIsLoadingNote(true);
        const savedNote = await firestoreService.loadNoteForStage(userId, currentStageId);
        setNote(savedNote);
        setIsLoadingNote(false);
      }
    };
    fetchNote();
  }, [userId, currentStageId]);

  const handleSaveNote = async () => {
    await firestoreService.saveNoteForStage(userId, currentStageId, note);
    showToast('Note enregistrée !');
  };

  return (
    <div className="animate-fade-in">
      <div className="bg-white p-4 rounded-xl shadow-lg">
        <h2 className="text-xl font-bold mb-4 text-center">Votre parcours, étape par étape</h2>
        <div className="flex items-start pb-4 space-x-4 overflow-x-auto">
          {timelineData.map((item) => (
            <div
              key={item.id}
              onClick={() => setCurrentStageId(item.id)}
              className={`flex-shrink-0 flex flex-col items-center justify-center text-center w-28 h-28 p-2 rounded-lg bg-slate-100 hover:bg-slate-200 cursor-pointer transition-all duration-300 ${currentStageId === item.id ? 'bg-slate-900 text-white transform -translate-y-1 shadow-lg' : ''}`}
            >
              <i
                className={`ph-bold ${item.icon} text-4xl mb-2 transition-colors ${currentStageId === item.id ? 'text-white' : 'text-slate-600'}`}
              ></i>
              <span className="font-semibold text-sm">{item.title}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-8">
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div dangerouslySetInnerHTML={{ __html: currentContent }} />
          <div className="mt-6 border-t pt-6">
            <h4 className="font-semibold text-lg mb-2 flex items-center">
              <i className="ph-bold ph-notebook mr-2"></i>Mes notes personnelles
            </h4>
            <p className="text-sm text-slate-500 mb-3">
              Cet espace est le vôtre. Notez vos pensées, questions, ou moments importants.
            </p>
            {isLoadingNote ? (
              <div className="w-full h-32 bg-slate-200 rounded-md animate-pulse"></div>
            ) : (
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full p-3 border border-slate-300 rounded-md h-32 focus:outline-none focus:ring-2 focus:ring-slate-500"
                placeholder="Écrivez ici..."
              ></textarea>
            )}
            <button
              onClick={handleSaveNote}
              disabled={isLoadingNote}
              className="mt-3 bg-green-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-green-500 transition-colors disabled:bg-slate-400"
            >
              Enregistrer mes notes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ===================================================================================
// --- 5. COMPOSANT PRINCIPAL DE L'APPLICATION (Le chef d'orchestre) ---
// ===================================================================================
export default function App() {
  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastInfo, setToastInfo] = useState({ message: '', type: 'success', isVisible: false });
  const [currentView, setCurrentView] = useState('parcours'); // 'parcours' or 'cuisine'

  useEffect(() => {
    const initialAuth = async () => {
      await signInAnonymously(auth);
    };

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser && !firebaseUser.isAnonymous) {
        const userData = await firestoreService.getUserData(firebaseUser.uid);
        setUser({ uid: firebaseUser.uid, ...userData });
      } else {
        setUser(null);
      }
      setAuthReady(true);
    });

    initialAuth();
    return () => unsubscribe();
  }, []);

  const showToast = (message, type = 'success') => {
    setToastInfo({ message, type, isVisible: true });
    setTimeout(() => setToastInfo((p) => ({ ...p, isVisible: false })), 3000);
  };

  const handleLogout = async () => {
    await signOut(auth);
    showToast('Vous avez été déconnecté.');
  };

  if (!authReady) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50 text-slate-600">
        Chargement de l'application...
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen">
      <Header user={user} onLoginClick={() => setIsModalOpen(true)} onLogoutClick={handleLogout} />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {!user ? (
          <LoggedOutView onLoginClick={() => setIsModalOpen(true)} />
        ) : (
          <div>
            <div className="mb-8 flex justify-center bg-slate-200 rounded-lg p-1 max-w-sm mx-auto">
              <button
                onClick={() => setCurrentView('parcours')}
                className={`w-1/2 px-4 py-2 font-semibold rounded-md flex items-center justify-center space-x-2 transition-colors ${currentView === 'parcours' ? 'bg-slate-900 text-white' : ''}`}
              >
                <i className="ph-bold ph-steps"></i>
                <span>Mon Parcours</span>
              </button>
              <button
                onClick={() => setCurrentView('cuisine')}
                className={`w-1/2 px-4 py-2 font-semibold rounded-md flex items-center justify-center space-x-2 transition-colors ${currentView === 'cuisine' ? 'bg-slate-900 text-white' : ''}`}
              >
                <i className="ph-bold ph-cooking-pot"></i>
                <span>Côté Cuisine</span>
              </button>
            </div>
            {currentView === 'parcours' ? (
              <ParcoursView userId={user.uid} showToast={showToast} />
            ) : (
              <CuisineView />
            )}
          </div>
        )}
      </main>
      <AuthModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} showToast={showToast} />
      <Toast {...toastInfo} />
      <FirebaseTest />
    </div>
  );
}
