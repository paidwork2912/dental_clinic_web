const { createApp, ref, onMounted } = Vue;

createApp({
    setup() {
        const isMenuOpen = ref(false);
        const showModal = ref(false);
        const showLightbox = ref(false);
        const lightboxIndex = ref(0);
        const navScrolled = ref(false);

        const selectedType = ref('In-Clinic');
        const selectedDate = ref(null);
        const selectedTime = ref(null);

        const today = new Date();
        const weekDates = Array.from({length: 7}, (_, i) => {
            const d = new Date(today);
            d.setDate(today.getDate() + i);
            return {
                day: d.toLocaleDateString('en-US', {weekday: 'short'}).toUpperCase(),
                date: d.getDate(),
                full: d.toDateString()
            };
        });
        selectedDate.value = weekDates[0].full;

        const timeSlots = {
            Morning: ['09:00 AM', '10:00 AM', '10:30 AM', '11:00 AM'],
            Afternoon: ['12:00 PM', '12:30 PM', '01:00 PM'],
            Evening: ['05:00 PM', '06:00 PM', '07:00 PM', '08:00 PM', '09:00 PM']
        };

        const unavailableSlots = ['10:30 AM', '01:00 PM', '06:00 PM'];

        const galleryImages = [
            { src: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800&q=80', alt: 'Modern Dental Chair & Equipment', category: 'Operating Theater' },
            { src: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&q=80', alt: 'Reception & Waiting Lounge', category: 'Reception' },
            { src: 'https://images.unsplash.com/photo-1571772996211-2f02c9727629?w=800&q=80', alt: 'Sterilization Room', category: 'Sterilization' },
            { src: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=800&q=80', alt: 'Clinic Exterior', category: 'Exterior' },
            { src: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=800&q=80', alt: 'Dental Tools Close-up', category: 'Equipment' },
            { src: 'https://images.unsplash.com/photo-1598256989800-fe5f95da9787?w=800&q=80', alt: 'Patient Consultation Room', category: 'Consultation' }
        ];

        const services = [
            { title: 'Dental Implants', desc: 'Permanent tooth replacement with titanium posts for a natural look and feel.', icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-3.12 3.16z', featured: true },
            { title: 'Clear Aligners', desc: 'Invisible braces that straighten teeth discreetly without metal wires.', icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z', featured: false },
            { title: 'Full Mouth Rehab', desc: 'Comprehensive restoration of all teeth for optimal function and aesthetics.', icon: 'M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 9c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z', featured: false },
            { title: 'Root Canal', desc: 'Pain-free treatment to save infected teeth and eliminate discomfort.', icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z', featured: false },
            { title: 'Cosmetic Dentistry', desc: 'Veneers, whitening, and smile makeovers for a dazzling appearance.', icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z', featured: false },
            { title: 'Tooth Extraction', desc: 'Gentle removal of problematic teeth with minimal discomfort.', icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z', featured: false }
        ];

        const whyChoose = [
            { title: 'Experienced Doctors', desc: '15+ years of specialized dental expertise with advanced certifications.', icon: 'M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z' },
            { title: 'Painless Treatment', desc: 'Advanced anesthesia and sedation options for anxiety-free procedures.', icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z' },
            { title: 'Advanced Equipment', desc: 'Digital X-rays, 3D imaging, and laser technology for precision care.', icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z' },
            { title: 'Affordable Pricing', desc: 'Transparent costs with flexible EMI options and insurance acceptance.', icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.65 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.6-4.18-1.62-4.18-3.67 0-1.72 1.39-2.84 3.11-3.21V4h2.67v1.95c1.86.45 2.79 1.86 2.85 3.39H14.3c-.05-1.11-.64-1.87-2.22-1.87-1.5 0-2.4.68-2.4 1.64 0 .84.65 1.39 2.67 1.91s4.18 1.39 4.18 3.91c-.01 1.83-1.38 2.83-3.12 3.16z' }
        ];

        const trustFactors = [
            '10,000+ Root Canal Treatments Successfully Completed',
            '1000+ Dental Implants Placed',
            'One of the oldest dental clinics',
            'Equipped with modern and advanced dental technology',
            'Pioneer of digital dentistry',
            'State-of-the-art dental clinic',
            'Strict sterilization protocols',
            'Personalized patient care'
        ];

        const consultants = [
            { dept: 'Orthodontia', doctors: ['Dr. Sharma', 'Dr. Patel'] },
            { dept: 'Prosthodontia', doctors: ['Dr. Kumar', 'Dr. Singh'] },
            { dept: 'Periodontia', doctors: ['Dr. Desai', 'Dr. Rao'] },
            { dept: 'Oral Surgery', doctors: ['Dr. Mehta', 'Dr. Joshi'] },
            { dept: 'Pedodontics', doctors: ['Dr. Gupta', 'Dr. Nair'] },
            { dept: 'Oral Diagnosis', doctors: ['Dr. Iyer', 'Dr. Shah'] }
        ];

        const reviews = ref([
            { author_name: 'Priya Sharma', profile_photo_url: 'https://ui-avatars.com/api/?name=Priya+Sharma&background=00A896&color=fff', rating: 5, text: 'The best dental experience I have ever had. Dr. Nitin was extremely gentle during my root canal treatment. Absolutely painless and the clinic is spotlessly clean!', relative_time_description: '2 weeks ago' },
            { author_name: 'Rahul Mehta', profile_photo_url: 'https://ui-avatars.com/api/?name=Rahul+Mehta&background=0B132B&color=fff', rating: 5, text: 'Got my dental implants done here. The team is highly professional and uses the latest technology. Highly recommended for anyone !', relative_time_description: '1 month ago' },
            { author_name: 'Sneha Patil', profile_photo_url: 'https://ui-avatars.com/api/?name=Sneha+Patil&background=00A896&color=fff', rating: 5, text: 'Very friendly staff and excellent service. My kids actually enjoy visiting the dentist now. The pediatric care here is outstanding.', relative_time_description: '3 weeks ago' },
            { author_name: 'Amit Desai', profile_photo_url: 'https://ui-avatars.com/api/?name=Amit+Desai&background=0B132B&color=fff', rating: 5, text: 'Had a full mouth rehabilitation done. The results are amazing - I can smile confidently again. Worth every penny!', relative_time_description: '2 months ago' },
            { author_name: 'Neha Gupta', profile_photo_url: 'https://ui-avatars.com/api/?name=Neha+Gupta&background=00A896&color=fff', rating: 5, text: 'The clear aligners treatment was smooth and the results exceeded my expectations. The doctors are very knowledgeable and caring.', relative_time_description: '1 week ago' },
            { author_name: 'Vikram Rao', profile_photo_url: 'https://ui-avatars.com/api/?name=Vikram+Rao&background=0B132B&color=fff', rating: 5, text: 'Cleanest clinic I have visited. The sterilization protocols are top-notch. Felt very safe and comfortable throughout my treatment.', relative_time_description: '3 days ago' }
        ]);

        const doctors = [
            {
                name: 'Dr. Nitin',
                title: 'BDS | PG Diploma in Implantology',
                image: 'https://ui-avatars.com/api/?name=Dr+Nitin&background=0B132B&color=fff&size=256&font-size=0.4',
                points: [
                    '15+ Years of Clinical Experience',
                    'Specialist in Dental Implants & Oral Surgery',
                    'PG Diploma in Implantology from reputed institute',
                    'Member of Indian Dental Association'
                ]
            },
            {
                name: 'Dr. Nisha',
                title: 'BDS, MDS',
                image: 'https://ui-avatars.com/api/?name=Dr+Nisha&background=00A896&color=fff&size=256&font-size=0.4',
                points: [
                    'MDS in Conservative Dentistry & Endodontics',
                    'Expert in Root Canal & Cosmetic Procedures',
                    'Advanced training in Laser Dentistry',
                    'Committed to painless treatment philosophy'
                ]
            }
        ];

        const openLightbox = (index) => {
            lightboxIndex.value = index;
            showLightbox.value = true;
            document.body.style.overflow = 'hidden';
        };

        const closeLightbox = () => {
            showLightbox.value = false;
            document.body.style.overflow = '';
        };

        const nextImage = () => {
            lightboxIndex.value = (lightboxIndex.value + 1) % galleryImages.length;
        };

        const prevImage = () => {
            lightboxIndex.value = (lightboxIndex.value - 1 + galleryImages.length) % galleryImages.length;
        };

        const confirmAppointment = () => {
            if (!selectedTime.value) {
                alert('Please select a time slot');
                return;
            }
            const msg = `Hello Dental Clinic, I would like to book an appointment.\n- Type: ${selectedType.value}\n- Date: ${selectedDate.value}\n- Time Slot: ${selectedTime.value}`;
            const url = `https://wa.me/911234567890?text=${encodeURIComponent(msg)}`;
            window.open(url, '_blank');
            showModal.value = false;
        };

        const scrollToSection = (id) => {
            const el = document.getElementById(id);
            if (el) {
                el.scrollIntoView({ behavior: 'smooth' });
                isMenuOpen.value = false;
            }
        };

        onMounted(() => {
            const handleScroll = () => {
                navScrolled.value = window.scrollY > 50;
            };
            window.addEventListener('scroll', handleScroll);
        });

        return {
            isMenuOpen, showModal, showLightbox, lightboxIndex, navScrolled,
            selectedType, selectedDate, selectedTime,
            weekDates, timeSlots, unavailableSlots,
            galleryImages, services, whyChoose, trustFactors, consultants, reviews, doctors,
            openLightbox, closeLightbox, nextImage, prevImage,
            confirmAppointment, scrollToSection
        };
    }
}).mount('#app');
