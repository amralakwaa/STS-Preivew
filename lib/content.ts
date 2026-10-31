export type Lang = 'ar' | 'en';
type L = { ar: string; en: string };

export const t = (v: L, lang: Lang) => v[lang];

export const nav: { id: string; label: L }[] = [
  { id: 'services', label: { ar: 'الخدمات', en: 'Solutions' } },
  { id: 'projects', label: { ar: 'المشاريع', en: 'Projects' } },
  { id: 'process', label: { ar: 'منهجيتنا', en: 'Method' } },
  { id: 'contact', label: { ar: 'تواصل', en: 'Contact' } },
];

export const hero = {
  badge: { ar: 'أنظمة أمنية وتقنيات ذكية معتمدة', en: 'Certified Security & Smart Systems' },
  title: { ar: 'نحمي منشآتك بذكاء لا يُرى… وأمان لا يتوقف', en: 'Intelligent security you can’t see. Protection that never sleeps.' },
  sub: {
    ar: 'كاميرات ذكية، تحكم بيومتري في الدخول، مراكز بيانات، شبكات وإنذار حريق معتمد من الدفاع المدني — بمعايير هندسية عالمية.',
    en: 'AI surveillance, biometric access control, Tier data centers, structured networks and certified fire alarms — engineered to global standards.',
  },
  cta1: { ar: 'اطلب عرض سعر', en: 'Request a quote' },
  cta2: { ar: 'استكشف الحلول', en: 'Explore solutions' },
};

export const stats: { n: number; suffix: string; label: L }[] = [
  { n: 150, suffix: '+', label: { ar: 'مشروع منجز', en: 'Projects delivered' } },
  { n: 99.4, suffix: '%', label: { ar: 'رضا العملاء', en: 'Client satisfaction' } },
  { n: 24, suffix: '/7', label: { ar: 'دعم هندسي', en: 'Engineering support' } },
  { n: 100, suffix: '%', label: { ar: 'اعتماد الدفاع المدني', en: 'Civil Defense certified' } },
];

export const services: { img: string; span: string; title: L; desc: L }[] = [
  { img: 'cctv-surveillance-systems', span: 'md:col-span-2 md:row-span-2', title: { ar: 'أنظمة كاميرات المراقبة', en: 'CCTV Surveillance' }, desc: { ar: 'كاميرات 4K بالذكاء الاصطناعي، كشف تسلل لحظي، وقراءة لوحات المركبات.', en: 'AI-driven 4K cameras with instant intrusion detection and plate recognition.' } },
  { img: 'access-control-systems', span: '', title: { ar: 'التحكم في الدخول', en: 'Access Control' }, desc: { ar: 'بصمة الوجه والبطاقات المشفرة والبوابات السريعة.', en: 'Facial biometrics, encrypted cards and speed gates.' } },
  { img: 'fire-alarm-systems', span: '', title: { ar: 'إنذار الحريق', en: 'Fire Alarm' }, desc: { ar: 'أنظمة معتمدة وفق NFPA والدفاع المدني.', en: 'NFPA & Civil Defense compliant systems.' } },
  { img: 'data-centers-and-server-rooms', span: 'md:col-span-2', title: { ar: 'مراكز البيانات وغرف الخوادم', en: 'Data Centers & Server Rooms' }, desc: { ar: 'تصميم وتنفيذ بنية Tier-3 مع تبريد وطاقة احتياطية.', en: 'Tier-3 infrastructure with redundant cooling and power.' } },
  { img: 'smart-home-automation', span: '', title: { ar: 'المنزل الذكي', en: 'Smart Home' }, desc: { ar: 'أتمتة الإضاءة والستائر والأمان بلمسة واحدة.', en: 'Lighting, shading and security in one tap.' } },
  { img: 'networks-and-infrastructure', span: '', title: { ar: 'الشبكات والبنية التحتية', en: 'Networks' }, desc: { ar: 'كابلات منظمة وألياف ضوئية وشبكات لاسلكية.', en: 'Structured cabling, fiber and enterprise Wi-Fi.' } },
];

export const projects: { img: string; name: L; tag: L }[] = [
  { img: 'al-faisaliah-commercial-tower', name: { ar: 'برج تجاري', en: 'Commercial Tower' }, tag: { ar: 'مراقبة + تحكم دخول', en: 'CCTV + Access' } },
  { img: 'central-data-center-tier-3', name: { ar: 'مركز بيانات Tier-3', en: 'Tier-3 Data Center' }, tag: { ar: 'بنية تحتية', en: 'Infrastructure' } },
  { img: 'grand-resort-and-spa-hospitality', name: { ar: 'منتجع فاخر', en: 'Grand Resort & Spa' }, tag: { ar: 'ضيافة', en: 'Hospitality' } },
  { img: 'al-nakheel-luxury-villa-automation', name: { ar: 'فيلا ذكية', en: 'Luxury Smart Villa' }, tag: { ar: 'أتمتة', en: 'Automation' } },
];

export const steps: { title: L; desc: L }[] = [
  { title: { ar: 'اكتشاف المتطلبات', en: 'Discovery' }, desc: { ar: 'جلسة استشارية لتحديد احتياجاتك الأمنية والتشغيلية.', en: 'A consultation to pin down your security and operational needs.' } },
  { title: { ar: 'المعاينة والتصميم', en: 'Survey & Design' }, desc: { ar: 'زيارة موقعية وتحليل مخاطر ومخططات تنفيذية.', en: 'On-site survey, risk analysis and shop drawings.' } },
  { title: { ar: 'التركيب', en: 'Installation' }, desc: { ar: 'تنفيذ بواسطة مهندسين معتمدين وفق معايير السلامة.', en: 'Certified engineers deploying to safety standards.' } },
  { title: { ar: 'التشغيل والتسليم', en: 'Commissioning' }, desc: { ar: 'اختبار شامل وتدريب الفريق وضمان معتمد.', en: 'Full testing, team training and certified warranty.' } },
  { title: { ar: 'دعم مستمر', en: 'Ongoing SLA' }, desc: { ar: 'صيانة دورية واستجابة طارئة على مدار الساعة.', en: 'Preventive servicing and 24/7 emergency dispatch.' } },
];

export const ui = {
  servicesTitle: { ar: 'منظومة متكاملة للأمن والتقنية', en: 'One ecosystem for security & technology' },
  servicesSub: { ar: 'حلول مصممة لحماية وتمكين الشركات والجهات الحكومية والمنازل.', en: 'Solutions built to protect and empower enterprises, government and homes.' },
  projectsTitle: { ar: 'مشاريع نفخر بها', en: 'Work we’re proud of' },
  processTitle: { ar: 'من الفكرة إلى التسليم', en: 'From idea to handover' },
  contactTitle: { ar: 'جاهز لترقية أمان منشأتك؟', en: 'Ready to upgrade your facility?' },
  contactSub: { ar: 'أرسل تفاصيلك وسيتواصل معك مهندس مختص بعرض سعر مفصّل.', en: 'Send your details and an engineer will reply with an itemized quote.' },
  name: { ar: 'الاسم', en: 'Name' },
  phone: { ar: 'رقم الجوال', en: 'Phone' },
  need: { ar: 'ما الذي تحتاجه؟', en: 'What do you need?' },
  send: { ar: 'إرسال الطلب', en: 'Send request' },
  sent: { ar: 'تم الاستلام — سنتواصل معك قريباً', en: 'Received — we’ll be in touch shortly' },
  rights: { ar: 'جميع الحقوق محفوظة لشركة STS', en: 'All rights reserved to STS SecureTech Systems' },
  scroll: { ar: 'مرّر', en: 'Scroll' },
};
