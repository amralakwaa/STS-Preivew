// Content taken from the STS Laravel site seeders.
import type { L } from "./i18n";

export const services: { slug: string; title: L; desc: L; features: { ar: string[]; en: string[] } }[] = [
 {
  "slug": "cctv-surveillance-systems",
  "title": {
   "ar": "أنظمة كاميرات المراقبة",
   "en": "CCTV Surveillance Systems"
  },
  "desc": {
   "ar": "حلول مراقبة أمنية ذكية متقدمة تعتمد على الذكاء الاصطناعي وكاميرات فائقة الدقة 4K مع تغطية شاملة وتسجيل مستمر.",
   "en": "Advanced AI-powered smart surveillance solutions, 4K ultra-HD cameras with comprehensive perimeter coverage and 24/7 recording."
  },
  "features": {
   "ar": [
    "كاميرات IP فائقة الدقة 4K و8K مع رؤية ليلية ملونة",
    "تحليلات الفيديو بالذكاء الاصطناعي وكشف التسلل اللحظي",
    "التعرف التلقائي على لوحات السيارات (LPR) والوجوه",
    "غرف تحكم ومراقبة مركزية وخوادم تخزين سحابية ومحلية (NVR/SAN)"
   ],
   "en": [
    "Ultra-HD 4K & 8K IP cameras with full-color night vision",
    "AI-driven video analytics with instant intrusion detection",
    "Automatic Number Plate Recognition (ANPR) and facial identification",
    "Central control room setups and scalable enterprise NVR/SAN storage"
   ]
  }
 },
 {
  "slug": "access-control-systems",
  "title": {
   "ar": "أنظمة التحكم في الدخول",
   "en": "Access Control Systems"
  },
  "desc": {
   "ar": "إدارة وصلاحيات المرور الذكية عبر البوابات الإلكترونية، والبطاقات المشفرة، وبصمات الوجه والأصابع للتحكم الفعال في الدخول.",
   "en": "Intelligent physical access management utilizing biometric facial scanning, encrypted smartcards, and electronic speed gates."
  },
  "features": {
   "ar": [
    "أجهزة التعرف على الوجه ثلاثية الأبعاد بدون لمس",
    "بوابات الدخول السريعة (Flap Barriers & Turnstiles)",
    "إدارة تصاريح الزوار وإصدار بطاقات QR الذكية",
    "أقفال ذكية للأبواب الزجاجية والمعدنية وخزائن البيانات"
   ],
   "en": [
    "Contactless 3D facial recognition terminals",
    "High-throughput speed gates and optical turnstiles",
    "Automated visitor management with digital QR badges",
    "Smart electronic locks for glass, timber, and server racks"
   ]
  }
 },
 {
  "slug": "time-attendance-systems",
  "title": {
   "ar": "أنظمة الحضور والانصراف",
   "en": "Time & Attendance Systems"
  },
  "desc": {
   "ar": "أتمتة إدارة دوام الموظفين وحساب ساعات العمل بدقة عبر بصمة الوجه والكف والتطبيقات السحابية المتكاملة مع ERP.",
   "en": "Automated workforce time-tracking and shift management via biometric terminals and cloud ERP sync."
  },
  "features": {
   "ar": [
    "تقنيات التحقق البيومتري المانعة للتزوير (Anti-Spoofing)",
    "تطبيق هاتف مع التحقق بالموقع الجغرافي (Geofencing)",
    "تقارير تفصيلية فورية للغياب والتأخير وساعات العمل الإضافية",
    "تكامل مباشر مع أنظمة مسيرات الرواتب ونظام العمل"
   ],
   "en": [
    "Anti-spoofing dual-lens biometric validation",
    "Mobile clock-in application with GPS geofencing parameters",
    "Real-time automated analytics for tardiness and overtime",
    "Seamless export and sync with payroll & ERP databases"
   ]
  }
 },
 {
  "slug": "fire-alarm-systems",
  "title": {
   "ar": "أنظمة إنذار الحريق",
   "en": "Fire Alarm Systems"
  },
  "desc": {
   "ar": "أنظمة كشف وإنذار مبكر للحرائق معتمدة من الدفاع المدني، تشمل اللوحات المعنونة والكواشف الدخانية والحرارية.",
   "en": "Civil Defense certified early-detection fire alarm infrastructure, addressable panels, and optical sensors."
  },
  "features": {
   "ar": [
    "لوحات تحكم معنونة ذكية تحدد موقع الخطر بدقة بالغة",
    "كواشف دخان بصرية وحرارية وغاز وكواشف شعاعية للمستودعات",
    "أنظمة الإخلاء الصوتي الذاتي والتوجيه في حالات الطوارئ",
    "ربط مباشر مع لوحات إطفاء الغاز ومضخات الحريق والمصاعد"
   ],
   "en": [
    "Intelligent addressable control panels pinpointing exact hazard zones",
    "Optical smoke, thermal, carbon monoxide, and beam detectors for warehouses",
    "Integrated emergency voice alarm and evacuation broadcast",
    "Interlocking with FM200/NOVEC gas suppression, elevators, and HVAC dampeners"
   ]
  }
 },
 {
  "slug": "intrusion-alarm-systems",
  "title": {
   "ar": "أنظمة كشف التسلل",
   "en": "Intrusion Alarm Systems"
  },
  "desc": {
   "ar": "تأمين الأسوار والمحيط الخارجي وحماية النوافذ والمداخل بحساسات حركة متطورة وتنبيهات فورية لغرف العمليات.",
   "en": "Perimeter fence protection, motion detection sensors, glass break detectors, and immediate central alarm alerting."
  },
  "features": {
   "ar": [
    "حساسات كشف الحركة المزدوجة (PIR + Microwave) للحدائق والمحيط",
    "كابلات ألياف بصرية وحساسات اهتزاز على الشبوك والأسوار",
    "حساسات كسر الزجاج وفتح الأبواب والنوافذ المغناطيسية",
    "اتصال فوري بالهاتف ورسائل SMS وإشعارات التطبيق المشفرة"
   ],
   "en": [
    "Dual-technology (PIR + Microwave) outdoor perimeter motion sensors",
    "Fiber-optic and microphonic fence perimeter disturbance sensing",
    "Acoustic glass-break and heavy-duty magnetic gate contacts",
    "Encrypted cloud app push notifications and automated GSM voice dialer"
   ]
  }
 },
 {
  "slug": "networks-and-infrastructure",
  "title": {
   "ar": "الشبكات والبنية التحتية",
   "en": "Networks & Infrastructure"
  },
  "desc": {
   "ar": "تمديد وتجهيز كابلات الألياف الضوئية والنحاسية Cat6/Cat7، وشبكات الـ Wi-Fi المؤسسية وسويتشات Cisco وAruba.",
   "en": "Structured cabling Cat6A/Cat7 & Fiber optics, enterprise Wi-Fi 6/7, and managed switching solutions."
  },
  "features": {
   "ar": [
    "تمديد شبكات الألياف البصرية (Fiber Optic) واختبارات OTDR المعتمدة",
    "شبكات Wi-Fi مؤسسية بتغطية شاملة وتجوال سلس بدون انقطاع",
    "توريد وتهيئة سويتشات Cisco, Aruba, Fortinet المدارة",
    "ترتيب وتنظيم كبائن الشبكة (Rack Management) ووضع العلامات الترقيمية"
   ],
   "en": [
    "End-to-end fiber splicing, testing, and Fluke/OTDR certification",
    "Seamless roaming Enterprise Wi-Fi 6/7 matrix with captive portals",
    "Configuration of high-density managed switches and Fortinet firewalls",
    "Precision cable management, patch panel mapping, and rack labeling"
   ]
  }
 },
 {
  "slug": "data-centers-and-server-rooms",
  "title": {
   "ar": "مراكز البيانات وغرف السيرفرات",
   "en": "Data Centers & Server Rooms"
  },
  "desc": {
   "ar": "تجهيز غرف السيرفرات المتطورة بأنظمة التبريد الدقيق، والـ UPS، وإطفاء الغاز FM200، والمراقبة البيئية.",
   "en": "Mission-critical server room fit-outs: precision cooling, online UPS, FM200/Novec fire suppression, and environmental telemetry."
  },
  "features": {
   "ar": [
    "أنظمة تبريد دقيق (Precision Cooling) للمحافظة على درجة الحرارة والرطوبة",
    "أنظمة طاقة احتياطية (UPS) ثلاثية الطور مع بطاريات طويلة العمر",
    "نظام إطفاء الحريق بالغاز النظيف الصديق للبيئة (FM200 / NOVEC)",
    "نظام مراقبة بيئية ذكي لحرارة الغرفة ورصد تسريب المياه والجهد الكهربائي"
   ],
   "en": [
    "Precision InRow and perimeter DX cooling with humidity management",
    "N+1 redundant online double-conversion three-phase UPS systems",
    "Clean agent gas fire suppression systems harmless to electronics",
    "Environmental monitoring units tracking temperature, humidity, and water ingress"
   ]
  }
 },
 {
  "slug": "smart-home-automation",
  "title": {
   "ar": "أنظمة المنازل الذكية",
   "en": "Smart Home Automation"
  },
  "desc": {
   "ar": "تحكم كامل وشامل بالإضاءة والتكييف والستائر والأنظمة الترفيهية عبر تطبيقات الهاتف والأوامر الصوتية الذكية.",
   "en": "Complete home automation ecosystem: lighting scenes, climate control, motorized drapery, and voice integration."
  },
  "features": {
   "ar": [
    "تحكم ذكي بالإضاءة (Dimming & RGB) وسيناريوهات الوصول والمغادرة",
    "تحكم بالتكييف الذكي لتوفير الطاقة وجدولة درجات الحرارة المناسبة",
    "ستائر كهربائية ذكية تفتح وتغلق تلقائياً حسب حركة الشمس",
    "مفاتيح لمس جدارية فاخرة وشاشات تحكم مدمجة تتناغم مع الديكور"
   ],
   "en": [
    "Architectural lighting control, ambient dimming, and arrival/departure scenes",
    "Smart thermostat integration reducing electricity expenditure up to 30%",
    "Motorized curtain and blind automation responsive to solar positioning",
    "Bespoke designer glass touch switches and wall-mounted touchscreens"
   ]
  }
 },
 {
  "slug": "audio-visual-systems",
  "title": {
   "ar": "الأنظمة السمعية والبصرية",
   "en": "Audio-Visual Systems"
  },
  "desc": {
   "ar": "تجهيز قاعات الاجتماعات والشاشات التفاعلية، والمسارح المنزلية، وأنظمة الصوتيات الموزعة للمساجد والمطاعم.",
   "en": "Conference room AV integrations, interactive smart boards, home cinemas, and multi-zone distributed background audio."
  },
  "features": {
   "ar": [
    "شاشات تفاعلية ذكية وكاميرات تتبع المتحدث تلقائياً لقاعات الاجتماعات",
    "أنظمة صوتية موزعة احترافية (Background Music & PA) مع تحكم متعدد المناطق",
    "شاشات العرض الرقمية الإعلانية (Digital Signage) وجدران الفيديو LED",
    "أنظمة مسرح منزلي فائقة مع صوت محيطي Dolby Atmos"
   ],
   "en": [
    "Speaker-tracking PTZ video conference bars and interactive 4K whiteboards",
    "Multi-zone distributed commercial audio and public address matrices",
    "Direct-view LED video walls and central digital signage management",
    "Acoustically treated private cinema installations with Dolby Atmos"
   ]
  }
 },
 {
  "slug": "hospitality-solutions",
  "title": {
   "ar": "حلول الفنادق والضيافة",
   "en": "Hospitality Solutions"
  },
  "desc": {
   "ar": "أنظمة إدارة غرف النزلاء (GRMS)، والأقفال الفندقية الذكية RFID، وشاشات الضيافة التفاعلية IP-TV.",
   "en": "Guest Room Management Systems (GRMS), contactless RFID hotel locks, and interactive IP-TV hospitality platforms."
  },
  "features": {
   "ar": [
    "نظام إدارة غرف النزلاء الذكي (GRMS) للتحكم بالإضاءة والتكييف بمجرد دخول الغرفة",
    "أقفال فندقية إلكترونية تدعم بطاقات RFID وبلوتوث الهاتف الذكي",
    "لوحات خارجية للأبواب مع جرس ولمبات مؤشرة لحالة الغرفة (DND / Make Up Room)",
    "شاشات تلفزيون فندقية تفاعلية تعرض رسالة ترحيب باسم النزيل وخدمات الفندق"
   ],
   "en": [
    "Automated GRMS energy saving algorithms triggering setback modes upon check-out",
    "Mobile Key BLE and Mifare RFID electronic mortise door locks",
    "Sleek capacitive glass corridor doorplates with DND/MUR indicators",
    "Interactive Hospitality IPTV streaming with personalized guest greetings"
   ]
  }
 },
 {
  "slug": "system-integration",
  "title": {
   "ar": "تكامل الأنظمة",
   "en": "System Integration"
  },
  "desc": {
   "ar": "ربط الأنظمة الأمنية والتقنية المختلفة ضمن منصة تحكم موحدة (PSIM/BMS) لتبادل البيانات واتخاذ القرارات الذكية.",
   "en": "Unifying disparate security, BMS, and IoT systems into a centralized, single-pane-of-glass management console."
  },
  "features": {
   "ar": [
    "منصة تحكم أمنية مركزية موحدة (PSIM) لجميع الفروع والمباني",
    "تكامل فوري بين الإنذار والكاميرات وبوابات الطوارئ والمصاعد",
    "ربط أنظمة المباني الذكية عبر بروتوكولات BACnet وModbus وAPI",
    "لوحات معلومات تحليلية ورسوم بيانية لأداء المنشأة ومعدلات الأمان"
   ],
   "en": [
    "Centralized PSIM control room architecture spanning regional facilities",
    "Automated cross-system logic: fire trip triggers door release and camera preset",
    "Open protocol building automation gateways (BACnet, Modbus, MQTT, REST APIs)",
    "Executive business intelligence dashboards visualizing facility safety KPIs"
   ]
  }
 },
 {
  "slug": "maintenance-and-technical-support",
  "title": {
   "ar": "الصيانة والدعم الفني",
   "en": "Maintenance & Technical Support"
  },
  "desc": {
   "ar": "عقود صيانة دورية ووقائية معتمدة، وفرق دعم فني سريعة الاستجابة على مدار الساعة لضمان استمرارية عمل الأنظمة.",
   "en": "Certified SLA preventative & corrective maintenance contracts with 24/7 on-call technical response teams."
  },
  "features": {
   "ar": [
    "عقود صيانة معتمدة لتقديمها للجهات الحكومية والدفاع المدني",
    "زيارات فحص دورية وقائية كل 3 أشهر لتنظيف وفحص المعدات",
    "خط طوارئ ساخن واستجابة سريعة خلال ساعتين للأعطال الحرجة",
    "توفير قطع الغيار الأصلية وضمان ممتد على جميع الأجهزة المركبة"
   ],
   "en": [
    "Official certified maintenance agreements recognized by Civil Defense & regulatory bodies",
    "Quarterly proactive diagnostic site visits, lens cleaning, and battery health checks",
    "Guaranteed rapid SLA response times (sub-2-hour dispatch for critical incidents)",
    "Original OEM spare parts stock and extended warranties on operational modules"
   ]
  }
 }
];

export const projects: { slug: string; name: L; city: L; sector: L; desc: L }[] = [
 {
  "slug": "al-faisaliah-commercial-tower",
  "name": {
   "ar": "برج الأعمال التجاري الذكي",
   "en": "Smart Commercial Business Tower"
  },
  "city": {
   "ar": "الرياض",
   "en": "Riyadh"
  },
  "sector": {
   "ar": "تجاري",
   "en": "Commercial"
  },
  "desc": {
   "ar": "تجهيز متكامل للبرج التجاري بأنظمة المراقبة CCTV فائقة الدقة، والتحكم في الدخول عبر بصمة الوجه، ونظام الدخول السريع عبر البوابات الإلكترونية.",
   "en": "Comprehensive integration of 4K CCTV surveillance, biometric facial recognition speed gates, and automated elevator destination control."
  }
 },
 {
  "slug": "grand-resort-and-spa-hospitality",
  "name": {
   "ar": "منتجع وفندق جراند لاكشري",
   "en": "Grand Luxury Resort & Spa"
  },
  "city": {
   "ar": "جدة",
   "en": "Jeddah"
  },
  "sector": {
   "ar": "ضيافة",
   "en": "Hospitality"
  },
  "desc": {
   "ar": "نظام إدارة غرف النزلاء (GRMS) الذكي لـ 240 جناحاً فندقياً، مع أقفال RFID المتطورة، والأنظمة الصوتية الموزعة في الحدائق والمسابح.",
   "en": "Full Guest Room Management System (GRMS) across 240 luxury suites, RFID mobile keys, and multi-zone outdoor background sound systems."
  }
 },
 {
  "slug": "al-nakheel-luxury-villa-automation",
  "name": {
   "ar": "قصر النخيل الذكي",
   "en": "Al-Nakheel Smart Palace"
  },
  "city": {
   "ar": "الخبر",
   "en": "Al-Khobar"
  },
  "sector": {
   "ar": "سكني",
   "en": "Residential"
  },
  "desc": {
   "ar": "أتمتة شاملة بتقنية KNX للقصور: الإضاءة، التكييف، الستائر، نظام السينما المنزلية Dolby Atmos، وتأمين الأسوار بحساسات التسلل الليزرية.",
   "en": "Full KNX automation for a luxury private estate: smart lighting, HVAC, automated drapes, Dolby Atmos cinema, and perimeter laser intrusion sensors."
  }
 },
 {
  "slug": "industrial-logistics-distribution-center",
  "name": {
   "ar": "مركز الخدمات اللوجستية والمستودعات المركزية",
   "en": "Central Logistics & Distribution Hub"
  },
  "city": {
   "ar": "الدمام",
   "en": "Dammam"
  },
  "sector": {
   "ar": "صناعي",
   "en": "Industrial"
  },
  "desc": {
   "ar": "شبكة أمنية صناعية متقدمة: كاميرات مراقبة متخصصة للمستودعات، كواشف دخان شعاعية (Beam Detectors)، وشبكة Wi-Fi للمستودعات الذكية.",
   "en": "Industrial security & infrastructure fit-out: optical beam fire detectors, high-bay CCTV monitoring, and ruggedized warehouse Wi-Fi."
  }
 },
 {
  "slug": "central-data-center-tier-3",
  "name": {
   "ar": "مركز البيانات الرئيسي",
   "en": "Enterprise Tier III Data Center"
  },
  "city": {
   "ar": "الرياض",
   "en": "Riyadh"
  },
  "sector": {
   "ar": "حكومي",
   "en": "Government"
  },
  "desc": {
   "ar": "تصميم وتنفيذ غرفة سيرفرات رئيسية بأنظمة تبريد دقيق InRow، وأنظمة UPS مضاعفة N+1، وإطفاء بالغاز النظيف NOVEC 1230.",
   "en": "Engineering and deployment of a Tier III server facility: InRow precision cooling, redundant N+1 UPS power banks, and clean NOVEC 1230 suppression."
  }
 },
 {
  "slug": "healthcare-specialty-hospital-av-security",
  "name": {
   "ar": "المستشفى التخصصي للرعاية الطبية",
   "en": "Specialty Healthcare Hospital"
  },
  "city": {
   "ar": "مكة المكرمة",
   "en": "Makkah"
  },
  "sector": {
   "ar": "تجاري",
   "en": "Commercial"
  },
  "desc": {
   "ar": "تكامل شامل لأنظمة نداء الممرضات، والتحكم في الدخول لأجنحة العمليات، والأنظمة الصوتية الطبية، وشاشات العرض التفاعلية.",
   "en": "Full IP nurse call integration, sterile operating theatre access control, emergency public address, and interactive digital signage."
  }
 }
];

// Client reviews from the STS site (names, roles and companies are kept in Arabic in both languages).
export const reviews: { name: string; role: string; company: string; city: string; project: string; quote: L }[] = [
 {
  "name": "م. فيصل بن عبدالله الراجحي",
  "role": "المشرف العام على مشاريع الضيافة",
  "company": "شركة أفق الضيافة للاستثمار",
  "city": "الرياض",
  "project": "كاميرات مراقبة AI ونظام GRMS",
  "quote": {
   "ar": "تعاقدنا مع الفريق لتنفيذ منظومة المراقبة الذكية وإدارة غرف النزلاء (GRMS) لأحد مشاريعنا الفندقية في الرياض. الالتزام بالمخططات الهندسية وتسليم المشروع في الوقت المحدد مع اعتماد الدفاع المدني كان نموذجياً وفاق توقعاتنا.",
   "en": "We partnered with the team to deploy AI CCTV and Hotel GRMS automation for our luxury hospitality project in Riyadh. Full engineering precision, on-time delivery, and Civil Defense approvals exceeded all our expectations."
  }
 },
 {
  "name": "أ. سلمان بن خالد الدوسري",
  "role": "مدير إدارة الأمن والسلامة والمرافق",
  "company": "أبراج العليا الإدارية",
  "city": "الرياض",
  "project": "بوابات ذكية Speed Gates ومراقبة مركزية",
  "quote": {
   "ar": "تم تركيب وتشغيل بوابات الدخول السريعة وكاميرات التعرف على الوجه في برجنا الإداري بكفاءة استثنائية. الدقة في ضبط الصلاحيات وربط المصاعد منحت المبنى انسيابية أمنية عالية وسهلت حركة الزوار والموظفين.",
   "en": "The optical speed gates and AI facial recognition cameras in our corporate tower run flawlessly. Smooth elevator integration and access control provided total security and fast throughput."
  }
 },
 {
  "name": "د. عبدالعزيز بن فهد الغامدي",
  "role": "مالك قصر خاص",
  "company": "قطاع الإسكان الفاخر",
  "city": "جدة",
  "project": "أتمتة منازل ذكية KNX وحماية محيط",
  "quote": {
   "ar": "تجربة أتمتة القصر عبر معيار KNX كانت ممتازة جداً. التحكم الكامل بالتكييف والإضاءة والستائر والسينما المنزلية من تطبيق واحد، مع شبكة كواشف وحماية الأسوار بالليزر، حققت أعلى معايير الخصوصية والأمان لعائلتي.",
   "en": "The KNX smart automation delivered an exceptional living experience. Unified climate, lighting, and home cinema control combined with perimeter laser defense provided maximum comfort and family privacy."
  }
 },
 {
  "name": "م. ماجد بن محمد القحطاني",
  "role": "مدير التشغيل والخدمات اللوجستية",
  "company": "مجمع المستودعات المركزية",
  "city": "الدمام",
  "project": "إنذار حريق معتمد للدفاع المدني",
  "quote": {
   "ar": "احترافية هندسية نادرة في تركيب كواشف الحريق الشعاعية والحرارية للأسقف العالية في مستودعاتنا بالدمام. تم إنهاء الاختبارات واستخراج تقرير المخططات والتراخيص الرسمية من منصة سلامة بسلاسة وبدون أي تأخير.",
   "en": "Outstanding engineering competence installing optical beam fire detection for our high-bay logistics warehouses. Testing and official Civil Defense Salamah certification were completed seamlessly."
  }
 },
 {
  "name": "أ. تركي بن ناصر المطيري",
  "role": "الرئيس التنفيذي للعمليات",
  "company": "مجمع أفق الأعمال المكتبي",
  "city": "الرياض",
  "project": "شبكات ألياف بصرية وغرف خوادم Data Center",
  "quote": {
   "ar": "فريق هندسي متمكن أشرف على تمديد شبكة الألياف الضوئية وتجهيز غرفة الخوادم الرئيسية بكوابل Cat6A وخزائن Racks معتمدة. تنظيم الكوابل والتوثيق والسرعات العالية تعكس معايير الجودة العالمية التي يلتزمون بها.",
   "en": "Highly certified technicians handled fiber optic distribution and our Tier III server room infrastructure. Impeccable structured cabling, labeling, and speed test validation."
  }
 },
 {
  "name": "الشيخ منصور بن حمد الشمري",
  "role": "مالك ومطور عقاري",
  "company": "مجمع فلل الواحة السكنية",
  "city": "الخبر",
  "project": "إنتركم IP وبوابات ANPR ذكية",
  "quote": {
   "ar": "قمنا بتركيب شبكة إنتركم مرئي IP وبوابات سيارات بنظام قراءة اللوحات الذكي لمجمعنا السكني بالخبر. الجودة متينة وخدمة ما بعد البيع والدعم الفني السريع يؤكدان أنهم الشريك التقني الأفضل دائماً.",
   "en": "Installed IP video intercom and ANPR license plate barrier systems for our residential gated compound in Khobar. Robust industrial quality and prompt after-sales technical support."
  }
 },
 {
  "name": "م. سعود بن إبراهيم السبيعي",
  "role": "استشاري المشاريع الكهروميكانيكية",
  "company": "السبيعي للاستشارات الهندسية",
  "city": "مكة المكرمة",
  "project": "نظام صوتيات وإخلاء صوتي طارئ",
  "quote": {
   "ar": "نظام الإخلاء الصوتي والإذاعة الداخلية الذي تم تركيبه بالمركز التجاري يتمتع بنقاء صوتي استثنائي وتوافق كامل مع المعايير الدولية ومتطلبات كود البناء السعودي. سعداء جداً بالشراكة والتعامل الراقي.",
   "en": "The emergency voice alarm and public address system installed in the commercial mall delivers crystal-clear acoustics and full Saudi Building Code compliance. An absolute pleasure to work with."
  }
 },
 {
  "name": "أ. طارق بن سلطان العتيبي",
  "role": "مدير إدارة المراكز التجارية",
  "company": "سلسلة مراكز النخبة للتسوق",
  "city": "جدة",
  "project": "كاميرات مراقبة بعدسات متطورة وتحليل AI",
  "quote": {
   "ar": "تغطية شاملة بزوايا رؤية دقيقة للممرات ومواقف السيارات، مع كاميرات قراءة لوحات السيارات وأنظمة تتبع متقدمة متوافقة تماماً مع اشتراطات وزارة الداخلية والأمن الوقائي. شكراً لفريق العمل المتميز.",
   "en": "Complete high-definition coverage for shopping galleries and parking zones, meeting all Ministry of Interior and preventive security standards. Exceptional engineering team."
  }
 },
 {
  "name": "م. وليد بن أحمد الشهري",
  "role": "المشرف على تقنية المعلومات",
  "company": "شركة البنيان للمقاولات",
  "city": "الرياض",
  "project": "سنترالات IP وحلول مراقبة الفروع",
  "quote": {
   "ar": "ربط فروعنا ومواقعنا الإنشائية بغرفة عمليات مركزية وسنترال IP موحد كان نقلة نوعية في سرعة التواصل والإشراف الميداني المباشر. خبرة فريق الدعم وسرعة استجابتهم لا تقدر بثمن.",
   "en": "Interconnecting our corporate branches and remote construction sites through a centralized IP telephony and video surveillance hub has transformed our operational efficiency."
  }
 },
 {
  "name": "أ. نايف بن سعد الحربي",
  "role": "مالك فيلا سكنية",
  "company": "مجمع ديار النرجس",
  "city": "الرياض",
  "project": "منزل ذكي موفر للطاقة وتحكم صوتي",
  "quote": {
   "ar": "أشكر المهندسين على نصائحهم الثمينة أثناء التأسيس. تم برمجة سيناريوهات الإضاءة والتكييف بطريقة ذكية ساهمت في خفض فاتورة الكهرباء بشكل ملموس مع راحة وتحكم كامل عبر الأوامر الصوتية والجوال.",
   "en": "Big thanks to the engineers for their invaluable guidance during initial rough-in. Smart lighting and HVAC schedules substantially reduced our utility bills with seamless voice control."
  }
 }
];

// Project details from the STS site.
export const projectDetails: Record<string, { client: string; place: string; year: string; content: L }> = {
 "al-faisaliah-commercial-tower": {
  "client": "شركة أفق للاستثمار العقاري",
  "place": "الرياض - طريق الملك فهد",
  "year": "2025",
  "content": {
   "ar": "تم تنفيذ المشروع على مساحة 25,000 متر مربع ويشمل 28 طابقاً، حيث تم تركيب أكثر من 350 كاميرا ذكية، و16 بوابة دخول سريعة بتقنية التعرف على الوجه، وشبكة ألياف ضوئية متكاملة لربط كافة مرافق البرج بغرفة التحكم المركزية.",
   "en": "Executed across 25,000 sqm encompassing 28 stories. Deployed 350+ smart IP cameras, 16 optical turnstiles with facial recognition, and a certified high-speed fiber backbone linking all building facilities to the central security command center."
  }
 },
 "grand-resort-and-spa-hospitality": {
  "client": "مجموعة شواطئ البحر الأحمر الفندقية",
  "place": "جدة - الكورنيش الشمالي",
  "year": "2025",
  "content": {
   "ar": "مشروع ضيافة متكامل يوفر أقصى درجات الرفاهية والتحكم الذكي لنزلاء المنتجع. يشمل لوحات تحكم لمسية جدارية للغرف، وتكامل الإضاءة مع التكييف لتوفير الطاقة بنسبة 35%، ونظام إنذار حريق معنون يغطي كافة أرجاء المنتجع.",
   "en": "A turnkey hospitality technology project delivering five-star guest comfort and energy optimization. Features capacitive touch bedside panels, occupancy-based climate automation saving 35% on cooling, and full Civil Defense certified fire alarm coverage."
  }
 },
 "al-nakheel-luxury-villa-automation": {
  "client": "عميل خاص",
  "place": "الخبر - حي الشاطئ",
  "year": "2025",
  "content": {
   "ar": "قصر خاص متكامل التقنيات على مساحة 4,500 متر مربع. تم ربط أكثر من 200 دائرة إضاءة وتكييف بنظام تحكم ذكي بشاشات لمس فاخرة وتطبيق هاتف موحد، مع تأمين كامل المحيط الخارجي بكاميرات حرارية ومستشعرات اهتزاز.",
   "en": "Palatial residential residence across 4,500 sqm. Integrated 200+ lighting and HVAC circuits through a bespoke KNX bus, custom glass touch panels, and secure remote mobile monitoring alongside perimeter thermal surveillance."
  }
 },
 "industrial-logistics-distribution-center": {
  "client": "الشركة الوطنية للخدمات اللوجستية",
  "place": "الدمام - المدينة الصناعية الثانية",
  "year": "2025",
  "content": {
   "ar": "تم تجهيز مجمع المستودعات البالغة مساحته 40,000 متر مربع بأنظمة حماية المحيط الخارجي، وتأمين البوابات عبر التعرف الآلي على لوحات شاحنات النقل (ANPR)، وتوفير بنية تحتية لاسلكية قوية تدعم أجهزة المسح الضوئي اللحظية.",
   "en": "Fitted out a 40,000 sqm industrial logistics center with perimeter security, automated ANPR truck gate barriers, high-sensitivity optical beam fire sensors, and high-density industrial wireless coverage for handheld RFID barcode scanners."
  }
 },
 "central-data-center-tier-3": {
  "client": "هيئة تقنية وطنية",
  "place": "الرياض - واحة التقنية",
  "year": "2024",
  "content": {
   "ar": "إنشاء بيئة خوادم عالية الكفاءة تدعم استمرارية تشغيل بنسبة 99.982%. يشمل المشروع 40 كابينة خوادم، وأنظمة مراقبة بيئية ذكية لحرارة ورطوبة الأجهزة، ونظام تحكم بالدخول عبر البصمة البيومترية المشفرة لخزائن السيرفرات.",
   "en": "Designed and commissioned a robust server facility guaranteeing 99.982% uptime. Features 40 high-density server racks, comprehensive temperature/humidity telemetry, and rack-level biometric access locks."
  }
 },
 "healthcare-specialty-hospital-av-security": {
  "client": "مجموعة الرعاية الحديثة الطبية",
  "place": "مكة المكرمة - العزيزية",
  "year": "2024",
  "content": {
   "ar": "تجهيز صرح طبي متقدم بسعة 180 سريراً. تم دمج نظام النداء الطبي السريع مع هواتف التمريض الذكية، وتركيب كاميرات مراقبة ذكية للأروقة والمداخل تراعي خصوصية المرضى، ونظام بطاقات ذكية للأطباء والكوادر التمريضية.",
   "en": "Equipped a 180-bed specialty hospital. Unified the IP nurse call alert matrix with staff mobile handsets, deployed compliant corridor CCTV, and implemented smart multi-level credential badges for medical teams."
  }
 }
};
