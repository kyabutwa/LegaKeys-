import React,{useEffect,useState}from"react";
import{createRoot}from"react-dom/client";
import{Activity,ArrowUpRight,Bell,ChevronDown,CircleHelp,Clock3,Home,KeyRound,Layers3,MapPin,Menu,Search,Settings2,ShieldCheck,Sparkles,UserRound,WalletCards,Wrench,X,Building2,Users,BriefcaseBusiness,CheckCircle2,AlertCircle,Plus,Globe2,Brain,GitBranch,Zap,LockKeyhole,Compass,LogIn,UserPlus,Handshake,Moon,Sun,Palette,ChevronLeft,Car,Truck,ShoppingBag,Utensils,HeartPulse,GraduationCap,ShieldAlert,FileText,Fingerprint,ScanLine,Smartphone,Upload,Camera,Check,Clock4}from"lucide-react";
import"./styles.css";

type Section="Home"|"Places"|"Services"|"Access"|"Payments"|"Activity"|"Workspaces"|"Identity"|"Intelligence"|"World"|"Execution";
const nav:[Section,React.ElementType][]= [["Home",Home],["Places",MapPin],["Services",Layers3],["Access",KeyRound],["Payments",WalletCards],["Activity",Activity]];

type LegaLanguage="en"|"fr"|"sw"|"lg"|"es"|"ar"|"ki"|"tz"|"lu"|"rw"|"rn"|"so"|"juba"|"ln";
const LANGUAGE_OPTIONS:{code:LegaLanguage;label:string;native:string;dir:"ltr"|"rtl"}[]=[
 {code:"en",label:"English",native:"English",dir:"ltr"},
 {code:"fr",label:"French",native:"Français",dir:"ltr"},
 {code:"sw",label:"Swahili",native:"Kiswahili",dir:"ltr"},
 {code:"lg",label:"Kilega",native:"Kilega",dir:"ltr"},
 {code:"es",label:"Latino",native:"Español (Latino)",dir:"ltr"},
 {code:"ar",label:"Arabic",native:"العربية",dir:"rtl"},
 {code:"ki",label:"Kenya — Kikuyu",native:"Gĩkũyũ",dir:"ltr"},
 {code:"tz",label:"Tanzania — Kiswahili",native:"Kiswahili",dir:"ltr"},
 {code:"lu",label:"Uganda — Luganda",native:"Luganda",dir:"ltr"},
 {code:"rw",label:"Rwanda — Kinyarwanda",native:"Kinyarwanda",dir:"ltr"},
 {code:"rn",label:"Burundi — Kirundi",native:"Ikirundi",dir:"ltr"},
 {code:"so",label:"Somalia — Somali",native:"Soomaali",dir:"ltr"},
 {code:"juba",label:"South Sudan — Juba Arabic",native:"عربي جوبا",dir:"rtl"},
 {code:"ln",label:"DRC — Lingála",native:"Lingála",dir:"ltr"}
];
const UI_TRANSLATIONS:Record<LegaLanguage,Record<string,string>>={
 en:{},
 fr:{
  "Welcome Home":"Bienvenue chez vous","Soyez le bienvenu":"Bienvenue chez vous","Your identity. Your world. One ecosystem.":"Votre identité. Votre monde. Un seul écosystème.",
  "Join as a Participant":"Rejoindre en tant que participant","Join a Community":"Rejoindre une communauté","Join as a Community":"Rejoindre en tant que communauté",
  "Build your identity and enter LegaKeys as a person.":"Créez votre identité et entrez dans LegaKeys en tant que personne.",
  "Enter a community where your participation and scope are explicit.":"Rejoignez une communauté où votre participation et votre périmètre sont explicites.",
  "Create a governed community space for residents, workers, providers, services, maintenance and plans.":"Établissez un espace communautaire gouverné pour les résidents, travailleurs, prestataires, services, maintenance et plans.",
  "Choose your way in":"Choisissez votre voie d'accès","Identity":"Identité","World":"Monde","Services":"Services","Intelligence":"Intelligence",
  "People":"Personnes","Places":"Lieux","Operations":"Opérations","No Authorization → No Consequential Action.":"Aucune autorisation → Aucune action conséquente.",
  "Search":"Rechercher","Settings & account":"Paramètres et compte","Help & guidance":"Aide et accompagnement","Security & sessions":"Sécurité et sessions",
  "Navigate":"Navigation","Deep LegaKeys":"LegaKeys approfondi","Home":"Accueil","Access":"Accès","Payments":"Paiements","Activity":"Activité","Workspaces":"Espaces de travail",
  "Current context":"Contexte actuel","Choose a context":"Choisir un contexte","Personal":"Personnel","Community":"Communauté","Declared":"Déclaré",
  "Appearance":"Apparence","Dark":"Sombre","White":"Blanc","Navy":"Bleu nuit","Interface mode":"Mode d'interface","Desktop mode":"Mode bureau","Mobile mode":"Mode mobile",
  "Back":"Retour","Back to":"Retour à","Ask Constantyna":"Demander à Constantyna","Good to see you":"Heureux de vous revoir","Neon connected":"Neon connecté","Checking Neon":"Vérification de Neon",
  "Explore LegaKeys":"Explorer LegaKeys","View all":"Tout voir","View all services":"Voir tous les services","Governed by design":"Gouverné par conception",
  "Authorization remains the execution boundary.":"L'autorisation reste la limite d'exécution."
 },
 sw:{
  "Welcome Home":"Karibu nyumbani","Join as a Participant":"Jiunge kama mshiriki","Join a Community":"Jiunge na jumuiya","Join as a Community":"Jiunge kama jumuiya",
  "Build your identity and enter LegaKeys as a person.":"Jenga utambulisho wako na uingie LegaKeys kama mtu.",
  "Enter a community where your participation and scope are explicit.":"Ingia katika jumuiya ambapo ushiriki na mipaka yako iko wazi.",
  "Choose your way in":"Chagua njia yako ya kuingia","Identity":"Utambulisho","World":"Dunia","Services":"Huduma","Intelligence":"Akili",
  "People":"Watu","Places":"Maeneo","Operations":"Uendeshaji","Access":"Ufikiaji","Payments":"Malipo","Activity":"Shughuli","Workspaces":"Nafasi za kazi",
  "Home":"Nyumbani","Search":"Tafuta","Settings & account":"Mipangilio na akaunti","Help & guidance":"Msaada na mwongozo","Security & sessions":"Usalama na vipindi",
  "Navigate":"Abiri","Current context":"Muktadha wa sasa","Choose a context":"Chagua muktadha","Personal":"Binafsi","Community":"Jumuiya","Declared":"Imetangazwa",
  "Appearance":"Mwonekano","Dark":"Giza","White":"Nyeupe","Navy":"Bluu ya giza","Interface mode":"Hali ya kiolesura","Desktop mode":"Hali ya kompyuta","Mobile mode":"Hali ya simu",
  "Ask Constantyna":"Muulize Constantyna","Good to see you":"Nafurahi kukuona","Neon connected":"Neon imeunganishwa","Checking Neon":"Inakagua Neon",
  "Explore LegaKeys":"Chunguza LegaKeys","View all":"Tazama yote","Governed by design":"Imeundwa kwa utawala","Authorization remains the execution boundary.":"Idhini ndiyo mpaka wa utekelezaji.",
  "No Authorization → No Consequential Action.":"Hakuna idhini → Hakuna hatua yenye matokeo."
 },
 lg:{
  "Welcome Home":"Samba Balega","Identity":"Kitambulisho","World":"Igulu","Services":"Mikolo","People":"Bantu","Community":"Bantu","Home":"Kulia",
  "Search":"Londa","Settings & account":"Mitema na akaunti","Help & guidance":"Lusango","Access":"Kwingila","Payments":"Mikolo ya malipo",
  "Activity":"Mikolo","Places":"Mbalo","Operations":"Mikolo ya mulimo","Intelligence":"Bumanyi","Navigate":"Kwingila",
  "Join as a Participant":"Samba nga mushiriki","Join a Community":"Samba mu bantu","Join as a Community":"Samba nga bantu"
 },
 es:{
  "Welcome Home":"Bienvenido a casa","Join as a Participant":"Unirse como participante","Join a Community":"Unirse a una comunidad","Join as a Community":"Unirse como comunidad",
  "Build your identity and enter LegaKeys as a person.":"Crea tu identidad y entra en LegaKeys como persona.",
  "Enter a community where your participation and scope are explicit.":"Entra en una comunidad donde tu participación y alcance sean claros.",
  "Choose your way in":"Elige cómo entrar","Identity":"Identidad","World":"Mundo","Services":"Servicios","Intelligence":"Inteligencia",
  "People":"Personas","Places":"Lugares","Operations":"Operaciones","Home":"Inicio","Access":"Acceso","Payments":"Pagos","Activity":"Actividad","Workspaces":"Espacios de trabajo",
  "Search":"Buscar","Settings & account":"Configuración y cuenta","Help & guidance":"Ayuda y orientación","Security & sessions":"Seguridad y sesiones",
  "Navigate":"Navegar","Current context":"Contexto actual","Choose a context":"Elegir contexto","Personal":"Personal","Community":"Comunidad","Declared":"Declarado",
  "Appearance":"Apariencia","Dark":"Oscuro","White":"Blanco","Navy":"Azul marino","Interface mode":"Modo de interfaz","Desktop mode":"Modo escritorio","Mobile mode":"Modo móvil",
  "Ask Constantyna":"Preguntar a Constantyna","Good to see you":"Qué bueno verte","Neon connected":"Neon conectado","Checking Neon":"Comprobando Neon",
  "Explore LegaKeys":"Explorar LegaKeys","View all":"Ver todo","Governed by design":"Gobernado por diseño","Authorization remains the execution boundary.":"La autorización sigue siendo el límite de ejecución.",
  "No Authorization → No Consequential Action.":"Sin autorización → Sin acción consecuente."
 },
 ki:{
  "Welcome Home":"Nĩ wega gũcoka mũciĩ","Home":"Mũciĩ","Identity":"Ũhoro wa mũndũ","Community":"Kĩama","Services":"Ũtungata","Access":"Kũingia","Payments":"Matuĩro","Activity":"Ũgĩciarĩ","Search":"Rũrĩa","Settings & account":"Mĩhĩrĩga na akaũnti","Join as a Participant":"Ũngĩrĩre ta mũthikĩrĩria","Join a Community":"Ũngĩrĩre kĩama","Choose your way in":"Hũthũrũra njĩra ya kũingia"
 },
 tz:{
  "Welcome Home":"Karibu nyumbani","Home":"Nyumbani","Identity":"Utambulisho","Community":"Jumuiya","Services":"Huduma","Access":"Ufikiaji","Payments":"Malipo","Activity":"Shughuli","Search":"Tafuta","Settings & account":"Mipangilio na akaunti","Join as a Participant":"Jiunge kama mshiriki","Join a Community":"Jiunge na jumuiya","Choose your way in":"Chagua njia yako ya kuingia"
 },
 lu:{
  "Welcome Home":"Tusanyuse okukulaba ewaka","Home":"Awaka","Identity":"Obumanyirivu","Community":"Ekitundu","Services":"Obuweereza","Access":"Okuyingira","Payments":"Okusasula","Activity":"Emirimu","Search":"Noonya","Settings & account":"Enteekateeka n'akawunti","Join as a Participant":"Yingira ng'omwetabye","Join a Community":"Yingira mu kitundu","Choose your way in":"Londa engeri gy'oyingiramu"
 },
 rw:{
  "Welcome Home":"Murakaza neza iwanyu","Home":"Ahabanza","Identity":"Umwirondoro","Community":"Umuryango","Services":"Serivisi","Access":"Kwinjira","Payments":"Kwishyura","Activity":"Ibikorwa","Search":"Shakisha","Settings & account":"Igenamiterere na konti","Join as a Participant":"Injira nk'uwitabira","Join a Community":"Injira mu muryango","Choose your way in":"Hitamo uburyo bwo kwinjira"
 },
 rn:{
  "Welcome Home":"Murakaza neza muhira","Home":"Ahabanza","Identity":"Umwirondoro","Community":"Umuryango","Services":"Serivisi","Access":"Kwinjira","Payments":"Kwishura","Activity":"Ibikorwa","Search":"Rondera","Settings & account":"Amagenamiterere na konti","Join as a Participant":"Injira nk'uwitabira","Join a Community":"Injira mu muryango","Choose your way in":"Hitamwo uburyo bwo kwinjira"
 },
 so:{
  "Welcome Home":"Ku soo dhawo guriga","Home":"Hoyga","Identity":"Aqoonsi","Community":"Bulsho","Services":"Adeegyo","Access":"Gelitaan","Payments":"Lacag-bixin","Activity":"Hawlaha","Search":"Raadi","Settings & account":"Dejinta iyo akoonka","Join as a Participant":"Ku biir ka-qaybgale","Join a Community":"Ku biir bulsho","Choose your way in":"Dooro habka aad ku soo gasho"
 },
 juba:{
  "Welcome Home":"أهلاً بيك في بيتك","Home":"الرئيسية","Identity":"الهوية","Community":"المجتمع","Services":"الخدمات","Access":"الدخول","Payments":"الدفع","Activity":"النشاط","Search":"بحث","Settings & account":"الإعدادات والحساب","Join as a Participant":"انضم كمشارك","Join a Community":"انضم إلى مجتمع","Choose your way in":"اختار طريقة الدخول"
 },
 ln:{
  "Welcome Home":"Boyei bolamu na ndako","Home":"Ndako","Identity":"Bomoto","Community":"Lisanga","Services":"Misala","Access":"Kokota","Payments":"Mafuti","Activity":"Mosala","Search":"Luka","Settings & account":"Bobongisi mpe akaunti","Join as a Participant":"Kota lokola mosangani","Join a Community":"Kota na lisanga","Choose your way in":"Pona lolenge ya kokota"
 }, ar:{
  "Welcome Home":"مرحباً بك في بيتك","Join as a Participant":"انضم كمشارك","Join a Community":"انضم إلى مجتمع","Join as a Community":"انضم كمجتمع",
  "Build your identity and enter LegaKeys as a person.":"أنشئ هويتك وادخل إلى LegaKeys كشخص.",
  "Enter a community where your participation and scope are explicit.":"ادخل مجتمعاً تكون فيه مشاركتك ونطاقك واضحين.",
  "Choose your way in":"اختر طريقة الدخول","Identity":"الهوية","World":"العالم","Services":"الخدمات","Intelligence":"الذكاء",
  "People":"الأشخاص","Places":"الأماكن","Operations":"العمليات","Home":"الرئيسية","Access":"الوصول","Payments":"المدفوعات","Activity":"النشاط","Workspaces":"مساحات العمل",
  "Search":"بحث","Settings & account":"الإعدادات والحساب","Help & guidance":"المساعدة والإرشاد","Security & sessions":"الأمان والجلسات",
  "Navigate":"التنقل","Current context":"السياق الحالي","Choose a context":"اختر سياقاً","Personal":"شخصي","Community":"المجتمع","Declared":"مُعلن",
  "Appearance":"المظهر","Dark":"داكن","White":"أبيض","Navy":"كحلي","Interface mode":"وضع الواجهة","Desktop mode":"وضع سطح المكتب","Mobile mode":"وضع الهاتف",
  "Ask Constantyna":"اسأل Constantyna","Good to see you":"سعيدون برؤيتك","Neon connected":"Neon متصل","Checking Neon":"جارٍ التحقق من Neon",
  "Explore LegaKeys":"استكشف LegaKeys","View all":"عرض الكل","Governed by design":"حوكمة حسب التصميم","Authorization remains the execution boundary.":"تبقى الموافقة هي حدّ التنفيذ.",
  "No Authorization → No Consequential Action.":"لا تفويض → لا إجراء تبعي."
 }
};
function detectLegaLanguage():LegaLanguage{
 const saved=localStorage.getItem("legakeys-language") as LegaLanguage|null;
 if(saved&&LANGUAGE_OPTIONS.some(x=>x.code===saved))return saved;
 const raw=(navigator.language||"en").toLowerCase();
 if(raw.startsWith("fr"))return "fr"; if(raw.startsWith("sw"))return "sw"; if(raw.startsWith("ar"))return "ar"; if(raw.startsWith("es"))return "es"; return "en";
}
function LanguageSwitcher({compact=false}:{compact?:boolean}){
 const[lang,setLang]=useState<LegaLanguage>(detectLegaLanguage);
 useEffect(()=>{localStorage.setItem("legakeys-language",lang);document.documentElement.dataset.language=lang;document.documentElement.dir=lang==="ar"?"rtl":"ltr";},[lang]);
 return <label className={"language-switcher "+(compact?"compact":"")} title="Language">
   <Globe2 size={15}/><select aria-label="Language" value={lang} onChange={e=>setLang(e.target.value as LegaLanguage)}>
    {LANGUAGE_OPTIONS.map(x=><option key={x.code} value={x.code}>{x.native}</option>)}
   </select>
 </label>
}
function installLegaTranslation(){
 const translate=()=>{
  const lang=(document.documentElement.dataset.language||"en") as LegaLanguage;
  const map=UI_TRANSLATIONS[lang]||{};
  const all=Object.entries(map);
  const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);
  let node:Node|null;
  while(node=walker.nextNode()){
   const parent=node.parentElement;
   if(!parent||["SCRIPT","STYLE","OPTION"].includes(parent.tagName))continue;
   const raw=node.textContent||"";
   const canonical=all.find(([en,tr])=>tr===raw)?.[0]||raw;
   const next=map[canonical];
   if(next&&next!==raw)node.textContent=next;
  }
  document.querySelectorAll<HTMLInputElement|HTMLTextAreaElement>("input,textarea").forEach(el=>{
   const raw=el.getAttribute("data-lk-placeholder-en")||el.getAttribute("placeholder")||"";
   if(!el.hasAttribute("data-lk-placeholder-en"))el.setAttribute("data-lk-placeholder-en",raw);
   const next=map[raw];if(next)el.placeholder=next;
  });
 };
 const observer=new MutationObserver(()=>requestAnimationFrame(translate));
 observer.observe(document.body,{subtree:true,childList:true,characterData:true});
 requestAnimationFrame(translate);
 return()=>observer.disconnect();
}

const services=[["BeatAccess","Access and entry",ShieldCheck],["BeatHome","Home, household and unit operations",Home],["BeatUtilities","Water, electricity, gas, internet and waste",Settings2],["BeatMaintenance","Maintenance, work orders, inspections and repairs",Wrench],["BeatFacility","Facilities, reservations and availability",Building2],["BeatCommunity","Community life, requests and participation",Users],["BeatVisitor","Visitor invitations, verification and access windows",Handshake],["BeatDelivery","Delivery verification, access and events",Truck],["BeatRide","Mobility discovery, booking and ride events",Car],["BeatPay","Payment intent, authorization and reconciliation",WalletCards],["BeatMarket","Products, services, sellers, orders and fulfillment",ShoppingBag],["BeatFood","Food discovery, menus, orders and delivery",Utensils],["BeatBnB","Listings, availability, bookings and stays",Compass],["BeatHealth","Health service discovery, requests and appointments",HeartPulse],["BeatGenzi","Learning, skills, education and development",GraduationCap],["BeatWork","Work discovery, opportunities, tasks and relationships",BriefcaseBusiness],["BeatGuardian","Safety, assistance, incidents and escalation",ShieldAlert]];
const deep=[["Workspaces","Operate in authorized scopes",BriefcaseBusiness],["Identity","Identity & participation",KeyRound],["Intelligence","GENESIS + Constantyna",Brain],["World","World + digital twin",Globe2],["Execution","Action → Event → Evidence",Zap]];
const foundationDomains=[["01","Runtime Contract","Canonical runtime boundary and cutover safety."],["02","Identity","Entity, identity, person, account, credential, session and participant."],["03","World","Places, physical entities, resources, relationships and world state."],["04","Context","Situation, scope, conditions and contextual references."],["05","Capability","Declared ability, scope, conditions, evidence and history."],["06","Authority","Authority sources, scopes, conditions, delegation and evidence."],["07","BeatAccess","Access points, credentials, evaluations, provider results and access events."],["08","BeatVisitor","Invitations, identity evidence, verification and visitor access lifecycle."],["09","Services","17 Beat services, offerings, capabilities, connections, requests, execution and outcomes."],["10","Action / Event / Evidence","Consequential action binding, execution, immutable events and evidence."],["11","GENESIS","Observation, findings, proposals, governed tools and evaluations."],["12","Digital Twin","Twin entities, properties, observations, relationships, transitions and scenarios."],["13","Workspaces","Community Operating and LegaKeys Operations with scoped membership and work."],["14","World Intelligence","Spatial, weather, Earth-system, climate and contextual intelligence."],["15","CONSTANTYNA","Human understanding, intent, needs, context, responses, memory and handoffs."]];

function Logo({light=false,markOnly=false}:{light?:boolean;markOnly?:boolean}){
 const[asset,setAsset]=useState("/legakeys-logo-transparent.svg");
 useEffect(()=>{
  let alive=true;const source=new Image();source.decoding="async";
  source.onload=()=>{
   try{
    const size=256,canvas=document.createElement("canvas");canvas.width=size;canvas.height=size;
    const ctx=canvas.getContext("2d",{willReadFrequently:true});if(!ctx)return;
    ctx.drawImage(source,0,0,size,size);const image=ctx.getImageData(0,0,size,size);
    for(let i=0;i<image.data.length;i+=4){
      const r=image.data[i],g=image.data[i+1],b=image.data[i+2];
      const luminance=(0.2126*r+0.7152*g+0.0722*b)/255;
      image.data[i+3]=Math.round(Math.max(0,Math.min(1,(luminance-0.045)*2.9))*255);
    }
    ctx.putImageData(image,0,0);if(alive)setAsset(canvas.toDataURL("image/png"));
   }catch{}
  };
  source.src="/IMG_1594.jpeg";return()=>{alive=false;source.onload=null};
 },[]);
 return <div className={"brand "+(light?"brand-light":"")+" "+(markOnly?"brand-mark-only":"")} aria-label="LegaKeys"><span className="brand-image brand-logo"><img src={asset} alt="LegaKeys"/></span>{!markOnly&&<b className="brand-name">LegaKeys</b>}</div>
}
function Status({children,green=false}:{children:React.ReactNode;green?:boolean}){return <span className={"status "+(green?"green":"")}><i/>{children}</span>}
function SectionPage({children}:{children:React.ReactNode}){return <section className="page-section">{children}</section>}

function LegaKeysSplash(){
 const[leaving,setLeaving]=useState(false);
 useEffect(()=>{const t=window.setTimeout(()=>setLeaving(true),650);return()=>window.clearTimeout(t)},[]);
 return <div className={"legakeys-splash "+(leaving?"leaving":"")} role="status" aria-label="LegaKeys">
   <div className="splash-core"><div className="splash-aura"/><img src="/legakeys-logo-transparent.svg" alt="LegaKeys" className="splash-logo"/><div className="splash-welcome"><span>Bienvenue chez vous</span><span>Welcome Home</span></div></div>
 </div>
}
class LegaKeysRenderBoundary extends React.Component<React.PropsWithChildren, {error:string|null}>{
 state={error:null as string|null};
 static getDerivedStateFromError(error:unknown){return {error:error instanceof Error?error.message:"Unexpected render error"}}
 componentDidCatch(error:unknown,info:React.ErrorInfo){console.error("LegaKeys render failure",error,info)}
 render(){
  if(this.state.error) return <div style={{minHeight:"100vh",background:"#07111f",color:"#f7fbff",display:"grid",placeItems:"center",padding:24,fontFamily:"system-ui,-apple-system,sans-serif"}}>
   <div style={{width:"min(560px,100%)",padding:28,border:"1px solid rgba(255,255,255,.14)",borderRadius:22,background:"#0f1b2d",boxShadow:"0 24px 80px rgba(0,0,0,.35)"}}>
    <div style={{color:"#58d68d",fontSize:11,fontWeight:800,letterSpacing:".14em"}}>LEG AKEYS · RENDER RECOVERY</div>
    <h1 style={{fontSize:28,margin:"12px 0 8px"}}>The LegaKeys surface hit a rendering error.</h1>
    <p style={{color:"#9aabba",lineHeight:1.6,margin:0}}>Your account and session are not being discarded. Reloading is safe; the rendering boundary is now explicit instead of leaving a black screen.</p>
    <button onClick={()=>location.reload()} style={{marginTop:18,padding:"11px 16px",border:0,borderRadius:12,fontWeight:800,cursor:"pointer"}}>Reload LegaKeys</button>
    <small style={{display:"block",marginTop:14,color:"#7f90a5",overflowWrap:"anywhere"}}>{this.state.error}</small>
   </div>
  </div>;
  return this.props.children;
 }
}
function Landing({onEnter,onAuthenticated,currentMe,onSignOut}:{onEnter:()=>void;onAuthenticated?:(me:any)=>void;currentMe?:any;onSignOut:()=>void}){
 const[auth,setAuth]=useState<"create"|"login"|null>(null);
 const[authEmail,setAuthEmail]=useState("");
 const[authPassword,setAuthPassword]=useState("");
 const[authPasswordConfirm,setAuthPasswordConfirm]=useState("");
 const[invitationConfirmationId,setInvitationConfirmationId]=useState("");
 const[authLegalName,setAuthLegalName]=useState("");
 const[authBusy,setAuthBusy]=useState(false);
 const[authError,setAuthError]=useState("");\n const[recoveryMode,setRecoveryMode]=useState(false);\n const[recoveryKey,setRecoveryKey]=useState("");\n const[recoveryPassword,setRecoveryPassword]=useState("");\n const[recoveryPasswordConfirm,setRecoveryPasswordConfirm]=useState("");
 const[join,setJoin]=useState(false);
 const[joinCode,setJoinCode]=useState("");
 const[pendingJoinCode,setPendingJoinCode]=useState("");
 const[communityCreate,setCommunityCreate]=useState(false);
 const[communityName,setCommunityName]=useState("");
 const[communityPurpose,setCommunityPurpose]=useState("");
 const[communityOperatorType,setCommunityOperatorType]=useState<"COMMUNITY"|"ORGANIZATION">("COMMUNITY");
 const[organizationName,setOrganizationName]=useState("");
 const[communityBusy,setCommunityBusy]=useState(false);

 const openParticipant=()=>setAuth("create");
 const closeAll=()=>{setAuth(null);setJoin(false);setCommunityCreate(false);setAuthError("");setRecoveryMode(false);setRecoveryKey("");setRecoveryPassword("");setRecoveryPasswordConfirm("")};
 const joinCommunity=async(code:string)=>{
   const r=await fetch("/api/community/join",{method:"POST",headers:{"content-type":"application/json"},credentials:"include",body:JSON.stringify({inviteCode:code})});
   const x=await r.json().catch(()=>({}));
   if(!r.ok||!x.ok)throw new Error(x.message||x.code||"Community join failed");
   return x;
 };

 return <div className="landing">
  <header className="landing-bar landing-bar-floating"><div className="landing-bar-side"/><Logo light markOnly/><div className="landing-bar-side landing-account-side">{currentMe?<button className="landing-signin" onClick={onSignOut}><span className="landing-avatar"><UserRound size={13}/></span><span><b>Sign out</b><small>Participant</small></span></button>:<button className="landing-signin" onClick={()=>setAuth("login")}><span className="landing-avatar"><LogIn size={13}/></span><span><b>Sign in</b><small>Participant</small></span></button>}</div></header>
  <main className="landing-main">
   <section className="landing-hero landing-hero-rebuilt">
    <div className="landing-copy">
      <div className="eyebrow light">YOUR IDENTITY. YOUR WORLD. ONE ECOSYSTEM.</div>
      <h1>A living digital world, governed around you.</h1>
      <p>LegaKeys connects people, communities, places, access, services, work, payments and intelligence in one ecosystem — while keeping authority explicit.</p>
    </div>
    <div className="landing-orientation">
      <div className="landing-orientation-label">CHOOSE YOUR WAY IN</div>
      <div className="entry-grid">
       <button className="entry-card" onClick={openParticipant}><span className="entry-icon"><UserRound size={22}/></span><span><b>Join as a Participant</b><small>Build your identity and enter LegaKeys as a person.</small></span><ArrowUpRight size={18}/></button>
       <button className="entry-card" onClick={()=>setJoin(true)}><span className="entry-icon"><Handshake size={22}/></span><span><b>Join a Community</b><small>Enter a community where your participation and scope are explicit.</small></span><ArrowUpRight size={18}/></button><button className="entry-card entry-card-signin" onClick={()=>currentMe?onSignOut():setAuth("login")}><span className="entry-icon"><LogIn size={22}/></span><span><b>{currentMe?"Sign out":"Sign in"}</b><small>{currentMe?"Leave your current LegaKeys session securely.":"Continue with your existing LegaKeys account."}</small></span><ArrowUpRight size={18}/></button>
       <button className="entry-card entry-card-community" onClick={()=>setCommunityCreate(true)}><span className="entry-icon"><Building2 size={22}/></span><span><b>Join as a Community</b><small>Create a governed community space for residents, workers, providers, services, maintenance and plans.</small></span><ArrowUpRight size={18}/></button>
      </div>
      <div className="landing-note"><ShieldCheck size={15}/>Identity, membership, capability and authorization remain separate.</div>
    </div>
   </section>

   <section className="landing-rail"><div><span><KeyRound size={16}/>Identity</span><b>One participant context</b></div><div><span><MapPin size={16}/>World</span><b>Places, buildings, units & spaces</b></div><div><span><Layers3 size={16}/>Services</span><b>17 declared Beat capabilities</b></div><div><span><Brain size={16}/>Intelligence</span><b>GENESIS + CONSTANTYNA</b></div></section>

   <section className="landing-section">
    <div className="section-intro"><div><div className="eyebrow">THE LEGAK EYS OPERATING MODEL</div><h2>From everyday life to enterprise operations.</h2></div><p>People participate. Communities operate their own scope. LegaKeys provides the shared platform, services and governance boundary.</p></div>
    <div className="landing-cards" aria-label="Core LegaKeys operating layers">
     {[["People","Participants, residents, owners, tenants, workers, visitors and members.",Users,"01"],["Places","Countries, cities, communities, phases, buildings, floors, units and facilities.",MapPin,"02"],["Operations","Providers, maintenance, work orders, services, plans and evidence.",Wrench,"03"],["Intelligence","GENESIS observes and proposes; CONSTANTYNA explains and guides.",Brain,"04"]].map(([t,d,I,n])=><article key={t as string} className="landing-card landing-capability-card"><div className="capability-card-top"><span className="capability-index">{n as string}</span><span className="capability-icon"><I size={20}/></span></div><div className="capability-copy"><h3>{t as string}</h3><p>{d as string}</p></div><ArrowUpRight className="capability-arrow" size={17}/></article>)}
    </div>
   </section>

   <section className="landing-section landing-services-preview">
    <div className="section-intro"><div><div className="eyebrow">ONE SERVICE ECOSYSTEM</div><h2>17 Beat services, one governed platform.</h2></div><p>Capabilities are LegaKeys-owned. Provider fulfillment is declared and verified separately.</p></div>
    <div className="landing-service-strip">{["BeatAccess","BeatHome","BeatUtilities","BeatMaintenance","BeatFacility","BeatCommunity","BeatVisitor","BeatDelivery","BeatRide","BeatPay","BeatMarket","BeatFood","BeatBnB","BeatHealth","BeatGenzi","BeatWork","BeatGuardian"].map((name,i)=><div className="landing-service-pill" key={name}><span>{String(i+1).padStart(2,"0")}</span>{name}</div>)}</div>
   </section>

   <section className="landing-bottom"><div><div className="eyebrow">THE GOVERNANCE BOUNDARY</div><h2>No Authorization → No Consequential Action.</h2><p>Community membership, provider status, capability and interface visibility never silently become execution authority.</p></div><button className="landing-primary" onClick={onEnter}>Explore LegaKeys <ArrowUpRight size={15}/></button></section>
  </main>

  {auth&&<div className="overlay" onMouseDown={closeAll}><div className="auth-modal" onMouseDown={e=>e.stopPropagation()}><button className="modal-close" onClick={closeAll}><X size={18}/></button><Logo/><div className="auth-icon">{auth==="create"?<UserPlus size={21}/>:<LogIn size={21}/>}</div><h2>{auth==="create"?"Join as a Participant":"Welcome back"}</h2><p>{auth==="create"?"Create your canonical LegaKeys account. Participation, community membership and authority are established separately.":"Sign in to continue to your governed LegaKeys space."}</p><label>Email<input type="email" value={authEmail} onChange={e=>setAuthEmail(e.target.value)} placeholder="you@example.com" autoComplete="email"/></label>{auth==="create"&&<label>Full legal name<input value={authLegalName} onChange={e=>setAuthLegalName(e.target.value)} placeholder="Your legal name" autoComplete="name"/></label>}<label>Password<input type="password" value={authPassword} onChange={e=>setAuthPassword(e.target.value)} placeholder="At least 12 characters" autoComplete={auth==="create"?"new-password":"current-password"}/></label>{auth==="create"&&<><label>Confirm password<input type="password" value={authPasswordConfirm} onChange={e=>setAuthPasswordConfirm(e.target.value)} placeholder="Re-enter your password" autoComplete="new-password"/></label><label>Invitation confirmation ID <span className="auth-optional">(optional)</span><input value={invitationConfirmationId} onChange={e=>setInvitationConfirmationId(e.target.value.trim())} placeholder="Only if you were invited" autoComplete="off"/></label></>}{authError&&<div className="auth-error">{authError}</div>}<button className="primary full" disabled={authBusy} onClick={async()=>{setAuthBusy(true);setAuthError("");try{const endpoint=auth==="create"?"/api/account/signup":"/api/auth/login";const payload=auth==="create"?{email:authEmail,password:authPassword,confirmPassword:authPasswordConfirm,legalName:authLegalName,invitationConfirmationId:invitationConfirmationId||undefined}:{email:authEmail,password:authPassword};const r=await fetch(endpoint,{method:"POST",headers:{"content-type":"application/json"},credentials:"include",body:JSON.stringify(payload)});const x=await r.json();if(!r.ok||!x.ok)throw new Error(x.message||x.code||"Authentication failed");if(auth==="create"){const login=await fetch("/api/auth/login",{method:"POST",headers:{"content-type":"application/json"},credentials:"include",body:JSON.stringify({email:authEmail,password:authPassword})});const lx=await login.json().catch(()=>null);if(!login.ok||!lx?.ok)throw new Error(lx?.message||lx?.code||"Account created, but the canonical session could not be opened");}const session=await fetch("/api/me",{credentials:"include",cache:"no-store"});const mx=await session.json().catch(()=>null);if(!session.ok||!mx?.ok||!mx?.data)throw new Error(mx?.message||mx?.code||"Account created, but the canonical session could not be opened");onAuthenticated?.(mx.data);if(pendingJoinCode){await joinCommunity(pendingJoinCode);setPendingJoinCode("");setJoinCode("")}setAuthPasswordConfirm("");setInvitationConfirmationId("");setAuth(null);setPreview(false);onEnter()}catch(e){const msg=e instanceof Error?e.message:"Authentication failed";if(auth==="create"&&/already exists|account exists|email.*exists|duplicate/i.test(msg)){setAuth("login");setAuthError("This account already exists. Sign in below with the same email and password.");}else setAuthError(msg)}finally{setAuthBusy(false)}}}>{authBusy?"Working…":auth==="create"?"Join as a Participant":"Sign in"} <ArrowUpRight size={15}/></button><small className="auth-foot">Your password must be confirmed before account creation. An invitation confirmation ID, when supplied, must be valid and match the invited email. Authentication creates the canonical account/session; it does not create community authority.</small>{auth==="login"&&!recoveryMode&&<button className="auth-recovery-link" type="button" disabled={authBusy} onClick={()=>{setAuthError("");setRecoveryMode(true)}}>Forgot your password?</button>}{auth==="login"&&recoveryMode&&<div className="auth-recovery-panel"><b>Recover your account</b><small>Use the recovery key you previously saved from Account → Sign-In & Security. It is single-use.</small><input type="text" value={recoveryKey} onChange={e=>setRecoveryKey(e.target.value.trim())} placeholder="Recovery key" autoComplete="off"/><input type="password" value={recoveryPassword} onChange={e=>setRecoveryPassword(e.target.value)} placeholder="New password" autoComplete="new-password"/><input type="password" value={recoveryPasswordConfirm} onChange={e=>setRecoveryPasswordConfirm(e.target.value)} placeholder="Confirm new password" autoComplete="new-password"/><button className="primary full" type="button" disabled={authBusy} onClick={async()=>{setAuthBusy(true);setAuthError("");try{const r=await fetch("/api/account/recovery-key/reset",{method:"POST",headers:{"content-type":"application/json"},credentials:"include",body:JSON.stringify({recoveryKey,newPassword:recoveryPassword,confirmPassword:recoveryPasswordConfirm})});const x=await r.json().catch(()=>null);if(!r.ok||!x?.ok)throw new Error(x?.message||x?.code||"Recovery failed");setRecoveryMode(false);setRecoveryKey("");setRecoveryPassword("");setRecoveryPasswordConfirm("");setAuthError("Password reset successfully. All active sessions were revoked. Sign in again.")}catch(e){setAuthError(e instanceof Error?e.message:"Recovery failed")}finally{setAuthBusy(false)}}}>Reset password</button><button className="auth-switch" type="button" disabled={authBusy} onClick={()=>{setRecoveryMode(false);setAuthError("")}}>Back to sign in</button></div>}<button className="auth-switch" type="button" disabled={authBusy} onClick={()=>{setAuthError("");setAuth(auth==="create"?"login":"create")}}>{auth==="create"?<>Already have an account? <b>Sign in</b></>:<>New to LegaKeys? <b>Join as a Participant</b></>}</button></div></div>}

  {join&&<div className="overlay" onMouseDown={closeAll}><div className="auth-modal join-modal" onMouseDown={e=>e.stopPropagation()}><button className="modal-close" onClick={closeAll}><X size={18}/></button><Logo/><div className="auth-icon"><Handshake size={21}/></div><h2>Join a Community</h2><p>Use the community invitation code supplied by its operator. A successful join creates participation in that community scope; it does not grant operational authority.</p><label>Invitation code<input value={joinCode} onChange={e=>setJoinCode(e.target.value.toUpperCase())} placeholder="LK-XXXXXXXXXX" autoComplete="off"/></label>{authError&&<div className="auth-error">{authError}</div>}<button className="primary full" onClick={async()=>{setAuthError("");if(!joinCode.trim()){setAuthError("Enter the community invitation code.");return}try{await joinCommunity(joinCode.trim());setJoin(false);setJoinCode("");onEnter()}catch(e){const msg=e instanceof Error?e.message:"Community join failed";if(msg.toLowerCase().includes("participant")||msg.toLowerCase().includes("session")){setPendingJoinCode(joinCode.trim());setJoin(false);setAuth("create")}else setAuthError(msg)}}}>Join Community <ArrowUpRight size={15}/></button><small className="auth-foot">You need a canonical LegaKeys participant account before joining a community.</small></div></div>}

  {communityCreate&&<div className="overlay" onMouseDown={closeAll}><div className="auth-modal join-modal" onMouseDown={e=>e.stopPropagation()}><button className="modal-close" onClick={closeAll}><X size={18}/></button><Logo/><div className="auth-icon"><Building2 size={21}/></div><h2>Join as a Community</h2><p>Create a governed Community Operating Workspace for your community or organization. You can coordinate residents, workers, providers, services, maintenance and plans within your scope.</p><label>Community name<input value={communityName} onChange={e=>setCommunityName(e.target.value)} placeholder="e.g. TSAVO Royal Suburbs" autoComplete="organization"/></label><label>Purpose<input value={communityPurpose} onChange={e=>setCommunityPurpose(e.target.value)} placeholder="What is this community for?" autoComplete="off"/></label><label>Created by<select value={communityOperatorType} onChange={e=>setCommunityOperatorType(e.target.value as "COMMUNITY"|"ORGANIZATION")}><option value="COMMUNITY">Community / estate team</option><option value="ORGANIZATION">Organization / operator</option></select></label>{communityOperatorType==="ORGANIZATION"&&<label>Organization name<input value={organizationName} onChange={e=>setOrganizationName(e.target.value)} placeholder="Legal or operating organization name" autoComplete="organization"/></label>}{authError&&<div className="auth-error">{authError}</div>}<button className="primary full" disabled={communityBusy} onClick={async()=>{setCommunityBusy(true);setAuthError("");try{const r=await fetch("/api/community/create",{method:"POST",headers:{"content-type":"application/json"},credentials:"include",body:JSON.stringify({name:communityName,purpose:communityPurpose,operatorType:communityOperatorType,organizationName})});const x=await r.json();if(!r.ok||!x.ok)throw new Error(x.message||x.code||"Community creation failed");setCommunityCreate(false);setCommunityName("");setCommunityPurpose("");setOrganizationName("");setCommunityOperatorType("COMMUNITY");onEnter()}catch(e){setAuthError(e instanceof Error?e.message:"Community creation failed")}finally{setCommunityBusy(false)}}}>{communityBusy?"Creating…":"Create community space"} <ArrowUpRight size={15}/></button><small className="auth-foot">Creation establishes a community identity and workspace. It does not self-grant authority or override LegaKeys service governance.</small></div></div>}
 </div>
}

function WorkspaceCenter({mode,onMode}:{mode:"COMMUNITY_OPERATING"|"LEGAKEYS_OPERATING";onMode:(m:"COMMUNITY_OPERATING"|"LEGAKEYS_OPERATING")=>void}){
 const[data,setData]=useState<any>(null),[busy,setBusy]=useState(true),[selected,setSelected]=useState(0);
 useEffect(()=>{let live=true;setBusy(true);const endpoint=mode==="COMMUNITY_OPERATING"?"/api/community-ops":"/api/workspace-center?type="+mode;fetch(endpoint,{credentials:"include"}).then(async r=>{const x=await r.json();if(!r.ok)throw new Error(x.message||x.code||"Workspace unavailable");return x}).then(x=>{if(live){setData(x);setSelected(0)}}).catch(()=>{if(live)setData(mode==="COMMUNITY_OPERATING"?{ok:false,data:[]}:{ok:false,workspaces:[]})}).finally(()=>{if(live)setBusy(false)});return()=>{live=false}},[mode]);
 const isCommunity=mode==="COMMUNITY_OPERATING";
 const title=isCommunity?"Community Operating System":"LegaKeys Operations Workspace";
 const purpose=isCommunity?"A secure operating layer for residents, workers, providers, services, maintenance and long-term community plans.":"Operate LegaKeys itself: product, engineering, identity, access, services, intelligence, infrastructure, governance and operations.";
 const modules:Array<[string,string,React.ElementType]>=isCommunity?[["People & participation","Residents, owners, workers, visitors and governed membership.",Users],["Places & facilities","Phases, buildings, units, common areas, facilities and operational context.",Building2],["Work & maintenance","Requests, work orders, inspections, incidents and evidence.",Wrench],["Services & providers","All 17 declared Beat services plus provider relationships and truth states.",Layers3],["Plans & strategy","Community objectives, initiatives, budgets, milestones, risks and measures.",Compass],["Access & visitors","Visitor, access and credential operations remain authorization-gated.",KeyRound],["Intelligence","GENESIS proposes; Constantyna explains; neither creates authority.",Brain]]:[["Product & engineering","Roadmap, releases, defects, architecture and technical operations.",GitBranch],["Identity & access","Account lifecycle, sessions, BeatAccess and policy boundaries.",KeyRound],["Services & providers","Declared capabilities, adapters, provider state and service governance.",Layers3],["Community operations","Participating communities, workspace boundaries and support.",Users],["Intelligence & world","GENESIS, Constantyna, Digital Twin and World Intelligence.",Brain],["Infrastructure & security","Runtime, database, deployment, security controls and observability.",ShieldCheck],["Governance & compliance","Policy, evidence, reviews, legal/compliance and decision history.",Compass]];
 const community=data?.data?.[selected];
 const ws=data?.workspaces?.[selected];
 return <section className="workspace-center"><div className="workspace-switcher"><button className={isCommunity?"active":""} onClick={()=>onMode("COMMUNITY_OPERATING")}>Community Operating</button><button className={!isCommunity?"active":""} onClick={()=>onMode("LEGAKEYS_OPERATING")}>LegaKeys Operations</button></div>
 <div className="workspace-hero"><div><span className="eyebrow">OPERATING WORKSPACE</span><h2>{title}</h2><p>{purpose}</p></div><div className="workspace-boundary"><ShieldCheck size={17}/><span>Visibility ≠ Authority<br/><b>No Authorization → No Consequential Action</b></span></div></div>
 {busy?<div className="workspace-empty">Loading governed operating state…</div>:isCommunity?(!community?<div className="workspace-empty"><Building2 size={25}/><b>No community operating space is assigned to this participant.</b><p>Create a community space from the landing page. LegaKeys will never invent a community, resident, provider or plan.</p></div>:<>
 <div className="workspace-status-row"><div><span>Community</span><b>{community.community.name}</b></div><div><span>Operator</span><b>{community.community.operator_type}</b></div><div><span>Residents</span><b>{community.metrics.residents}</b></div><div><span>Open work</span><b>{community.metrics.open_work}</b></div></div>
 <div className="workspace-metric-grid">{[["People",community.metrics.people,Users],["Workers",community.metrics.workers,BriefcaseBusiness],["Providers",community.metrics.providers,Handshake],["Services",community.metrics.configured_services+"/17",Layers3],["Plans",community.metrics.plans,Compass],["Open maintenance",community.metrics.open_work,Wrench]].map(([label,value,I])=><article className="workspace-metric" key={label as string}><span className="workspace-module-icon"><I size={17}/></span><div><small>{label as string}</small><strong>{value as any}</strong></div></article>)}</div>
 <div className="workspace-module-grid">{modules.map(([name,desc,I])=><article className="workspace-module" key={name as string}><span className="workspace-module-icon"><I size={18}/></span><div><h3>{name as string}</h3><p>{desc as string}</p></div><ArrowUpRight size={15}/></article>)}</div>
 <div className="workspace-columns"><div className="workspace-panel"><div className="panel-head"><div><span className="eyebrow">COMMUNITY PEOPLE</span><h3>Roster</h3></div><span className="panel-count">{community.people.length}</span></div>{community.people.length?community.people.slice(0,8).map((it:any)=><div className="workspace-item" key={it.id}><span className="item-dot"/><div><b>{it.relationship_type}</b><small>{String(it.participant_ref).slice(0,12)} · {it.state}</small></div><Status green={it.state==="ACTIVE"}>{it.state}</Status></div>):<p className="muted">No roster records are declared yet.</p>}</div>
 <div className="workspace-panel"><div className="panel-head"><div><span className="eyebrow">MAINTENANCE & WORK</span><h3>Work queue</h3></div><span className="panel-count">{community.work.length}</span></div>{community.work.length?community.work.slice(0,8).map((it:any)=><div className="workspace-item" key={it.id}><span className="item-dot"/><div><b>{it.title}</b><small>{it.priority} · {it.state}</small></div><Status green={it.state==="COMPLETED"}>{it.state}</Status></div>):<p className="muted">No maintenance work orders are recorded.</p>}</div></div>
 <div className="workspace-columns"><div className="workspace-panel"><div className="panel-head"><div><span className="eyebrow">SERVICES</span><h3>17 Beat services</h3></div><span className="panel-count">{community.services.length}/17</span></div>{community.services.slice(0,17).map((it:any)=><div className="workspace-item" key={it.id}><span className="item-dot"/><div><b>{it.canonical_name}</b><small>{it.beat_code} · {it.native_or_provider_mode}</small></div><Status green={it.truth_state==="DECLARED"||it.truth_state==="VERIFIED"}>{it.state}</Status></div>)}</div>
 <div className="workspace-panel"><div className="panel-head"><div><span className="eyebrow">COMMUNITY PLAN</span><h3>Strategy & projects</h3></div><span className="panel-count">{community.plans.length}</span></div>{community.plans.length?community.plans.slice(0,8).map((it:any)=><div className="workspace-item" key={it.id}><span className="item-dot"/><div><b>{it.name}</b><small>{it.state} · {it.objective}</small></div><ArrowUpRight size={14}/></div>):<p className="muted">No plan has been created yet.</p>}</div></div>
 <div className="workspace-boundary"><ShieldCheck size={17}/><span><b>Secure community boundary.</b> Community operators can coordinate records, plans and workflows in their scope. LegaKeys retains platform service control, while access, payments and other consequential actions remain authorization-gated.</span></div>
 </>):(!ws?<div className="workspace-empty"><BriefcaseBusiness size={25}/><b>No active LegaKeys workspace is assigned to this participant.</b><p>This is a truthful empty state. The platform will not invent an operational record.</p></div>:<><div className="workspace-status-row"><div><span>Workspace</span><b>{ws.workspace.name}</b></div><div><span>Role</span><b>{ws.membership?.role||"Not assigned"}</b></div><div><span>Lifecycle</span><b>{ws.workspace.lifecycle}</b></div><div><span>Work items</span><b>{ws.work_items?.length??0}</b></div></div><div className="workspace-module-grid">{modules.map(([name,desc,I])=><article className="workspace-module" key={name as string}><span className="workspace-module-icon"><I size={18}/></span><div><h3>{name as string}</h3><p>{desc as string}</p></div><ArrowUpRight size={15}/></article>)}</div></>)}
 </section>
}
function App(){
 const[preview,setPreview]=useState(true);
 const[splash,setSplash]=useState(true);
 useEffect(()=>{const t=window.setTimeout(()=>setSplash(false),1200);return()=>window.clearTimeout(t)},[]);
 const sectionFromLocation=():Section=>{const raw=location.hash.replace(/^#/,"") as Section;return (["Home","Places","Services","Access","Payments","Activity","Workspaces","Identity","Intelligence","World","Execution"] as Section[]).includes(raw)?raw:"Home"};
 const initialSection=sectionFromLocation();
 type Theme="dark"|"light"|"navy";
 const[theme,setTheme]=useState<Theme>(()=>{const saved=localStorage.getItem("legakeys-theme");return saved==="dark"||saved==="light"||saved==="navy"?saved:"navy"});
 const[layoutMode,setLayoutMode]=useState<"desktop"|"mobile">(()=>localStorage.getItem("legakeys-layout")==="mobile"?"mobile":"desktop");
 useEffect(()=>{document.documentElement.dataset.theme=theme;document.documentElement.style.colorScheme=theme==="light"?"light":"dark";localStorage.setItem("legakeys-theme",theme)},[theme]);
 useEffect(()=>{document.documentElement.dataset.layout=layoutMode;localStorage.setItem("legakeys-layout",layoutMode)},[layoutMode]);
 const[section,setSection]=useState<Section>(initialSection),[menu,setCurrentMenu]=useState(false),[search,setSearch]=useState(false),[assistant,setAssistant]=useState(false),[identity,setIdentity]=useState(false),[context,setContext]=useState(false),[settings,setSettings]=useState(false);
 const[workspaceMode,setWorkspaceMode]=useState<"COMMUNITY_OPERATING"|"LEGAKEYS_OPERATING">("COMMUNITY_OPERATING");
 const[me,setCurrentMe]=useState<any>(null);
 const[navStack,setNavStack]=useState<Section[]>([initialSection]);
 const canGoBack=navStack.length>1;
 const parentSection=canGoBack?navStack[navStack.length-2]:null;
 useEffect(()=>{
  const current=history.state?.legakeysSection as Section|undefined;
  if(!current) history.replaceState({legakeysSection:initialSection,legakeysStack:[initialSection]},"",location.pathname+location.search+(initialSection==="Home"?"":"#"+initialSection.toLowerCase()));
  const onPop=()=>{
   const state=history.state;
   const next=(state?.legakeysSection as Section|undefined)||"Home";
   const stack=Array.isArray(state?.legakeysStack)&&state.legakeysStack.length?state.legakeysStack as Section[]:["Home"];
   setSection(next);setNavStack(stack);setCurrentMenu(false);setSearch(false);setContext(false);
  };
  const onKey=(event:KeyboardEvent)=>{if((event.altKey&&event.key==="ArrowLeft")||((event.metaKey||event.ctrlKey)&&event.key==="[")){if(canGoBack){event.preventDefault();history.back()}}};
  window.addEventListener("popstate",onPop);
  window.addEventListener("keydown",onKey);
  return()=>{window.removeEventListener("popstate",onPop);window.removeEventListener("keydown",onKey)};
 },[]);
 const[liveServices,setLiveServices]=useState<any[]>([]),[dbState,setDbState]=useState("UNKNOWN");
 useEffect(()=>{fetch("/api/health",{credentials:"include",cache:"no-store"}).then(r=>r.json()).then(x=>setDbState(x.state??"UNKNOWN")).catch(()=>setDbState("UNAVAILABLE"));fetch("/api/services",{credentials:"include",cache:"no-store"}).then(r=>r.ok?r.json():null).then(x=>setLiveServices(x?.data??[])).catch(()=>setLiveServices([]));fetch("/api/me",{credentials:"include",cache:"no-store"}).then(r=>r.ok?r.json():null).then(x=>{if(x?.ok&&x?.data){setCurrentMe(x.data);setPreview(false)}}).catch(()=>undefined)},[]);
 if(splash)return <LegaKeysSplash/>;
 if(preview)return <Landing currentMe={me} onEnter={()=>setPreview(false)} onAuthenticated={(value)=>{setCurrentMe(value);setPreview(false)}} onSignOut={async()=>{await fetch("/api/auth/logout",{method:"POST",credentials:"include"}).catch(()=>undefined);setCurrentMe(null)}}/>;
 const subtitle:Record<Section,string>={Home:"Your identity, places, services and decisions — in one governed ecosystem.",Places:"Understand where you belong and what is connected.",Services:"Declared capabilities, available through governed access.",Access:"Entry, visitors and permissions are evaluated in context.",Payments:"Payment intent, authorization, execution and reconciliation.",Activity:"A traceable record of what happened.",Workspaces:"Operate in the context you are authorized to use.",Identity:"Your identity, participation and trust state.",Intelligence:"GENESIS + Constantyna: intelligence without self-granted authority.",World:"Places, physical entities, relationships and digital-twin state.",Execution:"Intent → Proposal → Authorization → Action → Event → Evidence."};
 const go=(s:Section)=>{
  if(s===section){setCurrentMenu(false);return}
  const next=[...navStack,s];
  setSection(s);setNavStack(next);setCurrentMenu(false);
  history.pushState({legakeysSection:s,legakeysStack:next},"",location.pathname+location.search+"#"+s.toLowerCase());
 };
 const goBack=()=>{if(canGoBack)history.back()};
 const jumpTo=(index:number)=>{
  const steps=navStack.length-1-index;
  if(steps>0)history.go(-steps);
 };
 return <div className={"app layout-"+layoutMode}>
  <header className="topbar"><div className="topbar-home-group"><button className="mobile-menu icon topbar-menu-button" onClick={()=>setCurrentMenu(!menu)} aria-label="Open LegaKeys menu" aria-expanded={menu}><Menu size={21}/></button></div><div className="topbar-centered-logo"><Logo markOnly/></div><div className="topbar-account"><button className="topbar-signin" onClick={async()=>{setCurrentMenu(false);if(me){await fetch("/api/auth/logout",{method:"POST",credentials:"include"}).catch(()=>undefined);setCurrentMe(null);setPreview(true)}else setPreview(true)}} aria-label={me?"Sign out of LegaKeys":"Sign in to LegaKeys"}><span className="topbar-avatar"><UserRound size={14}/></span><span className="topbar-signin-copy"><b>{me?"Sign out":"Sign in"}</b><small>Participant</small></span></button></div>{canGoBack&&<button className="nav-back" onClick={goBack} aria-label={`Back to ${parentSection}`} title={`Back to ${parentSection}`}><ChevronLeft size={18}/><span>{parentSection}</span></button>}</header>
  <aside className={"sidebar "+(menu?"open":"")}><div className="sidebar-scroll"><div className="menu-utility-section"><button className="menu-utility" onClick={()=>{setCurrentMenu(false);setSearch(true)}}><Search size={17}/><span>Search</span></button><button className="menu-utility" onClick={()=>{setCurrentMenu(false);setAssistant(true)}}><Sparkles size={17}/><span>Ask Constantyna</span></button><button className="menu-utility" onClick={()=>setCurrentMenu(false)}><Bell size={17}/><span>Notifications</span></button><button className="menu-utility" onClick={()=>{setCurrentMenu(false);setIdentity(true)}}><UserRound size={17}/><span>Identity</span></button></div><div className="menu-context-wrap"><button className="context menu-context" onClick={()=>setContext(!context)}><span className="context-icon"><MapPin size={15}/></span><span><b>Current context</b><small>Choose a context</small></span><ChevronDown size={15}/></button>{context&&<div className="popover context-pop"><b>Context</b><p>Context changes what LegaKeys can show. It never grants authority.</p><button><UserRound size={15}/>Personal <small>Declared</small></button><button><Building2 size={15}/>Community <small>Not connected</small></button></div>}</div><div className="nav-section"><label>Navigate</label>{nav.map(([name,Icon])=><button key={name} className={"nav-item "+(section===name?"active":"")} onClick={()=>go(name)}><Icon size={18}/><span>{name}</span></button>)}</div><div className="nav-section"><label>Deep LegaKeys</label>{deep.map(([name,desc,Icon])=><button key={name as string} className={"nav-item "+(section===name?"active":"")} onClick={()=>go(name as Section)}><Icon size={18}/><span>{name as string}</span></button>)}</div><div className="nav-section menu-settings-section"><label>Account & control</label><button className="nav-item" onClick={()=>{setCurrentMenu(false);setSettings(true)}}><Settings2 size={18}/><span>Settings & account</span></button><button className="nav-item" onClick={()=>setCurrentMenu(false)}><CircleHelp size={18}/><span>Help & guidance</span></button><button className="nav-item" onClick={()=>{setCurrentMenu(false);setSettings(true)}}><ShieldCheck size={18}/><span>Security & sessions</span></button></div><div className="trust-card"><ShieldCheck size={17}/><div><b>Governed by design</b><small>Authorization remains the execution boundary.</small></div></div></div></aside>
  <main className="main"><div className="content"><section className="hero"><div><nav className="breadcrumb-nav" aria-label="Navigation path">{navStack.map((item,i)=><React.Fragment key={`${item}-${i}`}><button className={i===navStack.length-1?"current":""} onClick={()=>i<navStack.length-1&&jumpTo(i)} aria-current={i===navStack.length-1?"page":undefined}>{item}</button>{i<navStack.length-1&&<span aria-hidden="true">/</span>}</React.Fragment>)}</nav><div className="hero-title-row">{canGoBack&&<button className="hero-back" onClick={goBack}><ChevronLeft size={17}/><span>Back to {parentSection}</span></button>}<label className="eyebrow">LEGAKEYS · {section.toUpperCase()}</label></div><h1>{section==="Home"?"Good to see you":section}</h1><p>{subtitle[section]}</p></div><div className="hero-actions"><Status green={dbState==="CONNECTED"}>{dbState==="CONNECTED"?"Neon connected":dbState==="NOT_CONFIGURED"?"Neon not configured":dbState==="UNAVAILABLE"?"Neon unavailable":"Checking Neon"}</Status><button className="primary" onClick={()=>setAssistant(true)}><Sparkles size={16}/>Ask Constantyna</button></div></section>
   {section==="Home"&&<><section className="feature-grid"><article className="feature dark"><div className="kicker"><Sparkles size={14}/>Intelligence</div><h2>What matters now?</h2><p>Nothing is presented as live or verified until LegaKeys has a source and provenance for it.</p><button className="text" onClick={()=>setAssistant(true)}>Ask Constantyna <ArrowUpRight size={15}/></button></article><article className="feature light"><div className="kicker"><ShieldCheck size={14}/>Trust boundary</div><h2>Every important decision is explicit.</h2><p className="trust"><CheckCircle2 size={16}/>Identity ≠ authorization</p><p className="trust"><CheckCircle2 size={16}/>Capability ≠ authority</p><p className="trust"><CheckCircle2 size={16}/>Interface ≠ execution</p></article></section><section className="system-rail" aria-label="LegaKeys governed control plane"><div className="system-rail-head"><div><div className="kicker"><Compass size={14}/>Control plane</div><h2>One system. Seven governed layers.</h2><p>The complexity stays underneath the participant experience.</p></div><Status green={dbState==="CONNECTED"}>{dbState==="CONNECTED"?"Core data connected":"Architecture governed"}</Status></div><div className="system-flow">{[["World","Modelled"],["Identity","Bound"],["Context","Scoped"],["Authority","Decided"],["Execution","Gated"],["Evidence","Traceable"],["Intelligence","Learning"]].map(([n,s],i)=><div className="system-node" key={n}><span className="system-index">{String(i+1).padStart(2,"0")}</span><div><b>{n}</b><small>{s}</small></div>{i<6&&<ArrowUpRight className="system-arrow" size={13}/>}</div>)}</div></section><Block title="Start here" desc="Move through LegaKeys without learning the architecture underneath it."><div className="action-grid">{[["Places","See connected places",MapPin],["Services","Explore declared capabilities",Layers3],["Access","Access and visitor controls",KeyRound],["Payments","Payment infrastructure",WalletCards]].map(([n,d,I])=><button className="action-card" key={n as string} onClick={()=>go(n as Section)}><I size={18}/><span><b>{n as string}</b><small>{d as string}</small></span><ArrowUpRight size={15}/></button>)}</div></Block><Block title="Services" desc="LegaKeys-owned services. Providers are fulfillment connections, never the service owner." action={<button className="ghost" onClick={()=>go("Services")}>View all <ArrowUpRight size={14}/></button>}><div className="service-grid">{(liveServices.length?liveServices:services).slice(0,8).map((s:any)=><button className="service-card" key={s.service_id||s[0]} onClick={()=>go("Services")}><span className="service-icon"><Layers3 size={18}/></span><span><b>{s.canonical_name||s[0]}</b><small>{s.description||s[1]}</small></span><ArrowUpRight size={14}/></button>)}</div></Block><Block title="Deep platform" desc="The architecture is not hidden; it is simply revealed when useful."><div className="action-grid deep-grid">{deep.map(([n,d,I])=><button className="action-card" key={n as string} onClick={()=>go(n as Section)}><I size={18}/><span><b>{n as string}</b><small>{d as string}</small></span><ArrowUpRight size={15}/></button>)}</div></Block><Block title="Foundation" desc="The canonical substrate behind the product surface. Every domain is explicit; no declared capability is presented as live provider state."><div className="foundation-grid">{foundationDomains.map(([n,t,d])=><article className="foundation-card" key={n}><span>{n}</span><div><b>{t}</b><small>{d}</small></div><Status>CANONICAL</Status></article>)}</div></Block></>}
   {section==="Services"&&<SectionPage><Notice title="Truthful service state">These are product capabilities, not invented provider availability. Live fulfillment appears only when a declared connection is verified.</Notice><div className="service-grid wide">{(liveServices.length?liveServices:services).map((s:any)=><button className="service-card" key={s.service_id||s[0]}><span className="service-icon"><Layers3 size={18}/></span><span><b>{s.canonical_name||s[0]}</b><small>{s.description||s[1]}</small><em>{s.truth_state||"DECLARED"} · {s.lifecycle_state||"ACTIVE"}</em></span><ArrowUpRight size={14}/></button>)}</div></SectionPage>}
   {section==="Places"&&<SectionPage><DataSurface icon={<MapPin size={23}/>} title="Places & living infrastructure" body="World → Country → City → Community → Phase → Building → Floor → Unit → Common Area → Facility → Workspace → Access Point." items={["Connected places","Relationships","Buildings & units","Facilities","Access points"]}/></SectionPage>}
   {section==="Access"&&<SectionPage><BeatAccessCenter/></SectionPage>}
   {section==="Payments"&&<SectionPage><DataSurface icon={<WalletCards size={23}/>} title="BeatPay" body="Payment intent, authorization, execution and reconciliation are separated. Provider connections are adapters, not the platform's source of truth." items={["Payment intents","Authorization","Execution","Provider adapters","Reconciliation"]}/></SectionPage>}
   {section==="Activity"&&<SectionPage><div className="activity-list">{[["Authorization required","A consequential action always exposes its scope before execution.","Policy",ShieldCheck],["Event / evidence trail","Events record what happened; evidence supports historical truth.","Verified",Activity],["Context is explicit","Place, time and relationship context are never silently assumed.","Declared",MapPin]].map(([t,b,s,I])=><article className="activity-row" key={t as string}><span className="activity-icon"><I size={16}/></span><div><b>{t as string}</b><p>{b as string}</p></div><Status green={s==="Verified"}>{s as string}</Status><Clock3 size={14}/></article>)}</div></SectionPage>}
   {section==="Workspaces"&&<WorkspaceCenter mode={workspaceMode} onMode={setWorkspaceMode}/>}
   {(section==="Identity"||section==="Intelligence"||section==="World"||section==="Execution")&&<SectionPage><DataSurface icon={section==="Intelligence"?<Brain size={23}/>:section==="World"?<Globe2 size={23}/>:section==="Execution"?<GitBranch size={23}/>:<KeyRound size={23}/>} title={section} body={subtitle[section]} items={section==="Execution"?["Intent","Proposal","Authorization","Action","Event","Evidence","Outcome"]:section==="Intelligence"?["GENESIS runs","Findings","Proposals","Constantyna sessions","Human understanding"]:section==="World"?["World entities","Places","Relationships","Observations","Digital twins"]:["BeatIdentity","Account","Session","Participant","Participation"]}/><Notice title="Visibility is not authority">This surface exposes the platform model without implying permission to execute consequential actions.</Notice></SectionPage>}
  </div></main><nav className="bottom-nav">{nav.slice(0,5).map(([n,I])=><button className={section===n?"active":""} onClick={()=>go(n)} key={n}><I size={18}/><span>{n}</span></button>)}</nav>
  {search&&<div className="overlay" onMouseDown={()=>setSearch(false)}><div className="command" onMouseDown={e=>e.stopPropagation()}><div className="command-search"><Search size={18}/><input autoFocus placeholder="Search people, places, services, activity..."/><kbd>ESC</kbd></div><div className="command-list"><label>Suggested</label>{[["Services",Layers3],["Access",KeyRound],["Intelligence",Brain],["Execution",Zap]].map(([n,I])=><button key={n as string} onClick={()=>{setSearch(false);go(n as Section)}}><I size={16}/>{n as string}<small>Explore</small></button>)}</div></div></div>}
  {assistant&&<div className="drawer-backdrop" onMouseDown={()=>setAssistant(false)}><aside className="assistant" onMouseDown={e=>e.stopPropagation()}><div className="drawer-head"><div><span className="assistant-mark"><Sparkles size={17}/></span><div><b>Constantyna</b><small>Human intelligence</small></div></div><button className="icon dark-icon" onClick={()=>setAssistant(false)}><X size={18}/></button></div><div className="assistant-body"><div className="assistant-intro"><span className="assistant-avatar"><Sparkles size={20}/></span><h2>Understand LegaKeys with me.</h2><p>I can explain, clarify, guide and prepare proposals. I cannot grant authority or execute consequential actions by myself.</p></div><div className="prompt-list"><button onClick={()=>{setAssistant(false);go("Services")}}>Show me available services</button><button onClick={()=>{setAssistant(false);go("Execution")}}>Explain authorization and execution</button><button onClick={()=>{setAssistant(false);go("World")}}>Show the world model</button></div></div><div className="assistant-input"><input placeholder="Ask Constantyna..."/><button className="primary"><ArrowUpRight size={15}/></button></div></aside></div>}
  {identity&&<div className="overlay" onMouseDown={()=>setIdentity(false)}><div className="identity-pop" onMouseDown={e=>e.stopPropagation()}><div className="identity-head"><span className="avatar large">K</span><div><b>Your identity</b><small>Protected participant context</small></div><button className="icon dark-icon" onClick={()=>setIdentity(false)}><X size={18}/></button></div><div className="identity-status"><ShieldCheck size={18}/><div><b>Trust boundary active</b><p>Authentication and authorization are separate. Every consequential action is evaluated in context.</p></div></div><button className="secondary full" onClick={()=>{setIdentity(false);setSettings(true)}}>Open account & settings <ArrowUpRight size={15}/></button><button className="text full" onClick={async()=>{await fetch("/api/auth/logout",{method:"POST",credentials:"include"});setCurrentMe(null);setIdentity(false);setPreview(true)}}>Sign out</button></div></div>}
  {settings&&<AccountCenter me={me} onClose={()=>setSettings(false)} onSignedOut={()=>{setCurrentMe(null);setSettings(false);setPreview(true)}}/>}
 </div>
}

function AccountCenter({me,onClose,onSignedOut}:{me:any;onClose:()=>void;onSignedOut:()=>void}){
 const[data,setData]=useState<any>(null),[trust,setTrust]=useState<any>(null),[settings,setSettings]=useState<any>(null),[busy,setBusy]=useState(false),[message,setMessage]=useState("");
 const[pw,setPw]=useState({currentPassword:"",newPassword:"",confirmPassword:""});
 const load=async()=>{const [a,t,s]=await Promise.all([fetch("/api/account",{credentials:"include",cache:"no-store"}),fetch("/api/identity/trust",{credentials:"include",cache:"no-store"}),fetch("/api/account/settings",{credentials:"include",cache:"no-store"})]);const ax=a.ok?await a.json():null,tx=t.ok?await t.json():null,sx=s.ok?await s.json():null;setData(ax?.data??null);setTrust(tx?.data??null);setSettings(sx?.data??null)};
 useEffect(()=>{load().catch(()=>undefined)},[]);
 const post=async(path:string,body:any={},confirmText?:string)=>{if(confirmText&&!confirm(confirmText))return;setBusy(true);setMessage("");try{const r=await fetch(path,{method:"POST",credentials:"include",headers:{"content-type":"application/json"},body:JSON.stringify(body)}),x=await r.json().catch(()=>null);if(!r.ok||!x?.ok)throw new Error(x?.code||"Operation failed");setMessage(x.state||"Saved");if(path==="/api/account/suspend"||path==="/api/account/close"){onSignedOut();return}await load()}catch(e){setMessage(e instanceof Error?e.message:"Operation failed")}finally{setBusy(false)}};
 const saveSetting=(key:string,value:any)=>{const next={...(settings||{}),[key]:value};setSettings(next);post("/api/account/settings",next)};
 const active=(data?.sessions??[]).filter((x:any)=>x.state==="ACTIVE").length;
 const displayName=me?.person?.display_name||me?.person?.legal_name||"Participant";
 const initials=displayName.split(/\\s+/).filter(Boolean).slice(0,2).map((x:string)=>x[0]).join("").toUpperCase()||"LK";
 return <div className="overlay" onMouseDown={onClose}><div className="settings-modal account-center-modal" onMouseDown={e=>e.stopPropagation()}>
  <div className="account-center-head"><div className="account-center-identity"><span className="account-center-avatar">{initials}</span><div><div className="eyebrow">LEGAKEYS ACCOUNT</div><h2>{displayName}</h2><p>{me?.identity_type||"PERSON"} · {me?.account_state||"ACTIVE"} · Participant context</p></div></div><button className="icon dark-icon" onClick={onClose} aria-label="Close account settings"><X size={18}/></button></div>
  <div className="account-center-intro"><ShieldCheck size={17}/><div><b>Your account is the control surface for your LegaKeys identity.</b><small>Authentication, identity, participation and authorization remain separate.</small></div></div>
  {message&&<div className="settings-message">{message}</div>}
  <div className="account-settings-list">
   <section className="account-setting-group"><div className="account-setting-title"><div><b>Personal information</b><small>Identity and participant record</small></div><UserRound size={17}/></div>
    <div className="account-setting-row account-setting-row-static"><span className="account-setting-symbol"><UserRound size={17}/></span><span><b>Legal name</b><small>{me?.person?.legal_name||"Not provided"}</small></span></div>
    <label className="account-setting-row"><span className="account-setting-symbol"><UserRound size={17}/></span><span><b>Display name</b><small>Participant-facing name</small></span><input className="account-inline-input" value={data?.account?.person?.display_name||displayName} onChange={e=>setData({...data,account:{...data.account,person:{...data.account.person,display_name:e.target.value}}})} onBlur={e=>post("/api/account/profile",{displayName:e.currentTarget.value})}/></label>
   </section>
   <section className="account-setting-group"><div className="account-setting-title"><div><b>Sign-In & Security</b><small>Credentials, recovery and session control</small></div><LockKeyhole size={17}/></div>
    <div className="account-setting-row account-setting-row-static"><span className="account-setting-symbol"><LockKeyhole size={17}/></span><span><b>Password</b><small>Protected credential · 12+ character policy</small></span><Status green={(data?.credentials??[]).some((x:any)=>x.credential_type==="EMAIL_PASSWORD"&&x.state==="ACTIVE")}>Active</Status></div>
    <div className="account-setting-row account-setting-row-static"><span className="account-setting-symbol"><ShieldCheck size={17}/></span><span><b>Identity assurance</b><small>{trust?.assurance_level||"L0"} · authentication does not grant authorization</small></span></div>
    <button className="account-setting-row" type="button" disabled={busy} onClick={async()=>{setBusy(true);setMessage("");try{const r=await fetch("/api/account/recovery-key",{method:"POST",credentials:"include",headers:{"content-type":"application/json"},body:"{}"}),x=await r.json();if(!r.ok||!x.ok)throw new Error(x.code||"Recovery key failed");setMessage("SAVE THIS RECOVERY KEY NOW: "+x.recovery_key+" · It will not be shown again.");}catch(e){setMessage(e instanceof Error?e.message:"Recovery key failed")}finally{setBusy(false)}}}><span className="account-setting-symbol"><KeyRound size={17}/></span><span><b>Generate recovery key</b><small>One-time secret for password recovery; store it offline.</small></span><ArrowUpRight size={15}/></button>
   </section>
   <section className="account-setting-group"><div className="account-setting-title"><div><b>Change password</b><small>Changing it revokes other active sessions</small></div><KeyRound size={17}/></div>
    <div className="account-form-grid"><input type="password" placeholder="Current password" value={pw.currentPassword} onChange={e=>setPw({...pw,currentPassword:e.target.value})}/><input type="password" placeholder="New password" value={pw.newPassword} onChange={e=>setPw({...pw,newPassword:e.target.value})}/><input type="password" placeholder="Confirm new password" value={pw.confirmPassword} onChange={e=>setPw({...pw,confirmPassword:e.target.value})}/><button className="primary" disabled={busy} onClick={()=>post("/api/account/password/change",pw)}>Change password</button></div>
   </section>
   <section className="account-setting-group"><div className="account-setting-title"><div><b>Sessions & devices</b><small>{active} active session{active===1?"":"s"} · independently revocable</small></div><Smartphone size={17}/></div>
    {(data?.sessions??[]).slice(0,8).map((x:any)=><div className="account-setting-row account-session-row" key={x.session_id}><span className="account-setting-symbol"><Smartphone size={17}/></span><span><b>{x.state==="ACTIVE"?"Active session":"Revoked session"}</b><small>{x.created_at?new Date(x.created_at).toLocaleString():""} · expires {x.expires_at?new Date(x.expires_at).toLocaleString():""}</small></span>{x.state==="ACTIVE"&&<button className="text account-revoke" disabled={busy} onClick={()=>post("/api/session/revoke",{session_id:x.session_id},"Revoke this session?")}>Revoke</button>}</div>)}
    <button className="secondary" disabled={busy} onClick={()=>post("/api/session/revoke-all",{},"Sign out all other active sessions?")}>Sign out other sessions</button>
   </section>
   <section className="account-setting-group"><div className="account-setting-title"><div><b>Participation & places</b><small>Contextual participation never silently becomes authority</small></div><Globe2 size={17}/></div>
    <div className="account-setting-row account-setting-row-static"><span className="account-setting-symbol"><Users size={17}/></span><span><b>Participant</b><small>{me?.participant?.state||"ACTIVE"} · membership and authority remain separate</small></span></div>
    <div className="account-setting-row account-setting-row-static"><span className="account-setting-symbol"><MapPin size={17}/></span><span><b>Participation scope</b><small>{JSON.stringify(me?.participation?.scope||{})}</small></span></div>
   </section>
   <section className="account-setting-group"><div className="account-setting-title"><div><b>Services & BeatAccess</b><small>Declared capabilities and governed access</small></div><Layers3 size={17}/></div>
    <div className="account-setting-row account-setting-row-static"><span className="account-setting-symbol"><KeyRound size={17}/></span><span><b>BeatAccess</b><small>Credentials are not permissions; authorization remains the execution boundary.</small></span></div>
    <div className="account-setting-row account-setting-row-static"><span className="account-setting-symbol"><Layers3 size={17}/></span><span><b>Beat services</b><small>Only declared and actually connected capabilities are represented.</small></span></div>
   </section>
   <section className="account-setting-group"><div className="account-setting-title"><div><b>Privacy & appearance</b><small>Persisted participant preferences</small></div><Palette size={17}/></div>
    <label className="account-setting-row"><span className="account-setting-symbol"><Palette size={17}/></span><span><b>Appearance</b><small>Presentation only</small></span><select value={settings?.appearance||"system"} onChange={e=>saveSetting("appearance",e.target.value)}><option value="system">System</option><option value="light">Light</option><option value="dark">Dark</option></select></label>
    <label className="account-setting-row"><span className="account-setting-symbol"><Globe2 size={17}/></span><span><b>Language</b><small>Account preference</small></span><select value={settings?.language||"en"} onChange={e=>saveSetting("language",e.target.value)}><option value="en">English</option><option value="fr">Français</option><option value="sw">Kiswahili</option><option value="ln">Lingála</option></select></label>
   </section>
  </div>
  <div className="settings-danger"><b>Account lifecycle</b><p>Suspend is reversible. Close is permanent and subject to retention requirements.</p><div className="settings-actions"><button className="secondary" disabled={busy} onClick={()=>post("/api/account/suspend",{},"Suspend this LegaKeys account and revoke all active sessions?")}>Suspend account</button><button className="danger" disabled={busy} onClick={()=>post("/api/account/close",{},"Close this account permanently?")}>Close account</button></div></div>
 </div></div>
}
function Notice({title,children}:{title:string;children:React.ReactNode}){return <div className="notice"><AlertCircle size={18}/><div><b>{title}</b><p>{children}</p></div></div>}
function BeatAccessCenter(){
 const[trust,setTrust]=useState<any>(null),[access,setAccess]=useState<any>(null),[busy,setBusy]=useState(false),[message,setCurrentMessage]=useState("");
 const load=async()=>{try{const[t,a]=await Promise.all([fetch("/api/identity/trust",{credentials:"include"}),fetch("/api/beataccess/overview",{credentials:"include"})]);setTrust(t.ok?await t.json():null);setAccess(a.ok?await a.json():null)}catch{setTrust(null);setAccess(null)}};
 useEffect(()=>{load()},[]);
 const submit=async(file:File,type:string,method:string,side:string)=>{
   setBusy(true);setCurrentMessage("");
   try{
     const buf=await file.arrayBuffer();const hash=Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256",buf))).map(x=>x.toString(16).padStart(2,"0")).join("");
     const r=await fetch("/api/identity/evidence",{method:"POST",headers:{"content-type":"application/json"},credentials:"include",body:JSON.stringify({evidenceType:type,captureMethod:method,documentSide:side,mimeType:file.type,fileSizeBytes:file.size,contentHash:hash})});
     const x=await r.json();if(!r.ok||!x.ok)throw new Error(x.code||"Submission failed");
     setCurrentMessage("Submitted securely as an evidence record. OCR/authenticity review remains a separate step.");await load();
   }catch(e){setCurrentMessage(e instanceof Error?e.message:"Submission failed")}finally{setBusy(false)}
 };
 const evidence=trust?.data?.evidence??[],verifications=trust?.data?.verifications??[],biometrics=trust?.data?.biometrics??[],points=access?.data?.access_points??[],operations=access?.data?.operations??[];
 const assurance=trust?.data?.assurance_level??"L0";
 const latest=(type:string)=>verifications.find((v:any)=>v.verification_type===type);
 return <section className="beataccess-center">
   <div className="beataccess-hero">
     <div><div className="kicker"><KeyRound size={16}/>BEATACCESS · TRUST FABRIC</div><h2>Access that knows the difference between recognition and authorization.</h2><p>Identity evidence, verification, credentials, context and authorization meet here. BeatAccess never creates permission; it safely enforces an existing decision.</p></div>
     <div className="assurance-card"><ShieldCheck size={21}/><div><small>IDENTITY ASSURANCE</small><strong>{assurance}</strong><span>{assurance==="L0"?"Unverified":assurance==="L1"?"Basic account assurance":assurance==="L2"?"Evidence verified":assurance==="L3"?"Strong identity":"High assurance / context specific"}</span></div></div>
   </div>
   <div className="beataccess-flow"><span>Identity evidence</span><b>→</b><span>Verification</span><b>→</b><span>Credential</span><b>→</b><span>Context</span><b>→</b><span>Authorization</span><b>→</b><span>BeatAccess</span><b>→</b><span>Event + evidence</span></div>
   <div className="beataccess-grid">
    <article className="beat-card beat-card-wide"><div className="beat-card-head"><div><span className="beat-icon"><FileText size={18}/></span><div><b>Identity Evidence Vault</b><small>Documents are submitted as governed evidence records — not as proof merely because OCR can read them.</small></div></div><Status green={evidence.some((e:any)=>e.truth_state==="VERIFIED")}>{evidence.length?evidence.length+" record"+(evidence.length===1?"":"s"):"No evidence"}</Status></div>
      <div className="evidence-upload-grid">
       <label className="evidence-drop"><Upload size={20}/><b>Submit identity document</b><small>Passport, national ID, residence permit, driver's licence or other evidence.</small><input type="file" accept="image/*,application/pdf" disabled={busy} onChange={e=>{const f=e.target.files?.[0];if(f)submit(f,"OTHER","PLATFORM_UPLOAD",f.type==="application/pdf"?"PDF":"FULL")}}/><span>{busy?"Processing…":"Choose file"}</span></label>
       <label className="evidence-drop"><Camera size={20}/><b>Scan with camera</b><small>Use the device camera for a fresh document capture. Authenticity is still separately verified.</small><input type="file" accept="image/*" capture="environment" disabled={busy} onChange={e=>{const f=e.target.files?.[0];if(f)submit(f,"OTHER","CAMERA","FULL")}}/><span>Capture document</span></label>
      </div>
      {message&&<div className="beat-message"><Check size={15}/>{message}</div>}
      <div className="beat-list">{evidence.slice(0,5).map((e:any)=><div key={e.evidence_id}><span><b>{e.evidence_type}</b><small>{e.submission_state} · {e.truth_state}</small></span><Status green={e.truth_state==="VERIFIED"}>{e.submission_state}</Status></div>)}</div>
    </article>
    <article className="beat-card"><div className="beat-card-head"><div><span className="beat-icon"><ScanLine size={18}/></span><div><b>Verification pipeline</b><small>Capture → quality → OCR → review → authenticity → identity match → verified.</small></div></div></div>
      <div className="verification-stack">{["DOCUMENT_OCR","DOCUMENT_AUTHENTICITY","IDENTITY_MATCH"].map(t=>{const v=latest(t);return <div key={t}><span><b>{t.replaceAll("_"," ")}</b><small>{v?.result_summary||"Awaiting evidence / approved verification path."}</small></span><Status green={v?.state==="PASSED"}>{v?.state||"PENDING"}</Status></div>})}</div>
      <div className="beat-note"><ShieldCheck size={15}/>OCR is extraction. It never becomes authenticity proof by itself.</div>
    </article>
    <article className="beat-card"><div className="beat-card-head"><div><span className="beat-icon"><Fingerprint size={18}/></span><div><b>Biometric methods</b><small>Each modality is separate. Raw biometric material is never placed in ordinary LegaKeys domain records.</small></div></div></div>
      <div className="biometric-grid">{[["FACE","Face verification"],["FINGERPRINT","Fingerprint"],["PALM_HAND","Palm / hand"],["DEVICE_BIOMETRIC","Device biometric"]].map(([m,label])=>{const b=biometrics.find((x:any)=>x.modality===m);return <div key={m} className="biometric-row"><span className="biometric-mark">{m==="FINGERPRINT"?<Fingerprint size={17}/>:m==="DEVICE_BIOMETRIC"?<Smartphone size={17}/>:<ScanLine size={17}/>}</span><div><b>{label}</b><small>{m==="DEVICE_BIOMETRIC"?"Local device authentication; LegaKeys receives no Face ID/Touch ID source data.":m==="PALM_HAND"?"Requires compatible capture hardware/provider.": "Requires an approved capture and verification path."}</small></div><Status green={b?.state==="VERIFIED"||b?.state==="ENROLLED"}>{b?.state||"NOT ENROLLED"}</Status></div>})}</div>
    </article>
    <article className="beat-card"><div className="beat-card-head"><div><span className="beat-icon"><KeyRound size={18}/></span><div><b>Credentials & access</b><small>Credential possession never substitutes for authorization.</small></div></div><Status green={points.some((p:any)=>p.operational_state==="ONLINE")}>{points.filter((p:any)=>p.operational_state==="ONLINE").length} online</Status></div>
      <div className="beat-metrics"><div><strong>{points.length}</strong><small>declared access points</small></div><div><strong>{operations.length}</strong><small>recent operations</small></div><div><strong>{access?.data?.credentials?.length||0}</strong><small>your access credentials</small></div></div>
      <div className="beat-note"><ShieldCheck size={15}/>No authorization → no access command. Command accepted ≠ access granted.</div>
    </article>
   </div>
   <article className="beat-card beat-timeline-card"><div className="beat-card-head"><div><span className="beat-icon"><Clock4 size={18}/></span><div><b>Access operations</b><small>Every consequential operation binds principal, authorization, action, target, access point, credential, time and idempotency.</small></div></div></div>
    {operations.length?<div className="beat-list">{operations.slice(0,8).map((o:any)=><div key={o.operation_id}><span><b>{o.action_type}</b><small>{o.operation_state} · authorization {String(o.authorization_id).slice(0,8)}…</small></span><Status green={o.operation_state==="ACCESS_GRANTED"}>{o.operation_state}</Status></div>)}</div>:<div className="beat-empty"><KeyRound size={18}/><div><b>No access operations recorded</b><small>Declared access points can be integrated later through a real controller/provider adapter. LegaKeys will never invent a live provider.</small></div></div>}
   </article>
   <div className="beataccess-boundary"><ShieldCheck size={18}/><div><b>Governance boundary</b><p>Authentication ≠ authorization · Assurance ≠ authority · Recognition ≠ permission · Community membership ≠ access · GENESIS and Constantyna cannot execute access.</p></div></div>
 </section>
}

function DataSurface({icon,title,body,items}:{icon:React.ReactNode;title:string;body:string;items:string[]}){return <div className="data-surface"><div className="data-head"><span>{icon}</span><div><h2>{title}</h2><p>{body}</p></div></div><div className="data-items">{items.map((x,i)=><div key={x}><span>{String(i+1).padStart(2,"0")}</span><b>{x}</b><ArrowUpRight size={14}/></div>)}</div></div>}
createRoot(document.getElementById("root")!).render(<LegaKeysRenderBoundary><App/></LegaKeysRenderBoundary>);
