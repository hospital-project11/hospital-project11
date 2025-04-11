export default function HomePage() {
  const locations = [
    {
      title: "Vision Correction",
      subtitle: "Lasik, PRK, Glasses & Contacts",
      image: "https://i.pinimg.com/736x/68/df/92/68df92dafaf6706a28417d034771d11c.jpg",
    },
    {
      title: "Retina Care",
      subtitle: "Diabetic Retinopathy, Macular Degeneration",
      image: "https://i.pinimg.com/736x/a0/f5/7e/a0f57e1bf714e123ce87fade03af55d2.jpg",
    },
    {
      title: "Cataract Treatment",
      subtitle: "Surgical Solutions, Lens Implants",
      image: "https://i.pinimg.com/736x/cc/d4/4a/ccd44ac7ea585fb6d33fac9a44ca39ef.jpg",
    },
    {
      title: "Pediatric Eye Care",
      subtitle: "Children’s Vision Testing & Treatment",
      image: "https://i.pinimg.com/736x/f2/a5/d2/f2a5d2d1f7cd0303704baee8285b1e9a.jpg",
    },
    {
      title: "Glaucoma Management",
      subtitle: "Pressure Control & Advanced Monitoring",
      image: "https://i.pinimg.com/736x/a6/fa/c2/a6fac28d643db208f67b6d9424516901.jpg",
    },
    {
      title: "Routine Eye Exams",
      subtitle: "Annual Checkups & Preventive Care",
      image: "https://i.pinimg.com/736x/b6/6a/aa/b66aaa43dfa8c771bc123717328f065a.jpg",
    },
  ];

  return (
    <>
    {/* herosection */}
    <section>
    <div className="relative mt-20 w-full overflow-hidden">
      {/* Video Background with teal gradient overlay */}
      <div className="relative min-h-[600px]">
        {/* Video element */}
        <video 
          className="absolute inset-0 w-full h-full object-cover z-0"
          autoPlay
          muted
          loop
          playsInline
        >
          <source src="https://videos.pexels.com/video-files/5995129/5995129-hd_1920_1080_30fps.mp4" type="video/mp4" />
          Your browser does not support video playback.
        </video>
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#006A71]  to-transparent z-10"></div>
        
        {/* Content container */}
        <div className="max-w-6xl mx-auto py-12 md:py-30 flex flex-col md:flex-row items-center justify-between relative z-20">
          
          {/* Text content - Left side */}
          <div className="text-white md:w-1/2 mb-8 md:mb-0">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
            See the World Clearly<br />
            with Lumera
            </h1>
            
            <div className="w-24 h-1 bg-white mb-6"></div>
            
            <p className="text-sm md:text-base opacity-90 mb-4 max-w-md">
              Specialized eye care tailored to your vision needs – from routine checkups to advanced treatments. Experience precision, compassion, and clarity with every visit.
            </p>
            
            <button className="bg-[#48A6A7] text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-teal-400 transition-all mt-4">
            Book Appointment
            </button>
          </div>
          
        </div>
      </div>
    </div>
    </section>

    {/* About us section  */}
    <section className="py-16 px-4 max-w-7xl mx-auto">
      {/* Header and Description */}
      <div className="flex flex-col md:flex-row justify-between items-start mb-12">
        <div className="md:max-w-2xl">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">About Us</h2>
          <p className="text-lg text-gray-500">
          Our team of specialized ophthalmologists and eye care experts delivers advanced diagnostics, compassionate treatment, and personalized care to help you see life in its clearest form.
          </p>
        </div>
        <div className="mt-6 md:mt-0">
          <a href="#" className="inline-flex items-center px-6 py-3 bg-[#48A6A7] text-white rounded-full font-medium hover:bg-[#006A71] transition-colors">
            Learn More
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </a>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left: Image */}
        <div className="lg:w-1/2">
          <div className="rounded-lg overflow-hidden shadow-lg">
            <img 
              src="https://images.pexels.com/photos/5996650/pexels-photo-5996650.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
              alt="Team meeting in conference room" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Right: Content */}
        <div className="lg:w-1/2 bg-gray-100 rounded-lg p-8">
          <h3 className="text-3xl font-bold text-gray-800 mb-2">
          How We’re Transforming Vision Care <br /> 
          with <span className="text-[#48A6A7]"> Precision & Compassion</span>
          </h3>
          
          <p className="text-gray-500 mb-4 mt-6">
          At Lumera, we are committed to safeguarding your most precious sense — your vision.
          </p>
          <p className="text-gray-500 mb-19 mt-4">
          Through cutting-edge technology and a patient-first approach, Lumera is redefining the standards of eye health and vision restoration.
          </p>
          
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-800">15+</p>
              <p className="text-gray-500">Years of Expertise</p>
            </div>
            
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-800">10,000+</p>
              <p className="text-gray-500">Eyes Treated</p>
            </div>
            
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-800">10+</p>
              <p className="text-gray-500">Award Won</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* why us section */}
    <section className="py-16 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-[#48A6A7] mb-2">Reasons to believe</p>
          <h2 className="text-3xl md:text-4xl font-bold text-[#48A6A7] mb-4">Discover What Sets Lumera Apart</h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
          At Lumera Eye Care, we’re redefining vision care with a focus on innovation, compassion, and precision.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1 */}
          <div className="relative rounded-lg overflow-hidden shadow-md group">
            <img 
              src="https://images.pexels.com/photos/5996596/pexels-photo-5996596.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
              alt="Medical team in operating room" 
              className="w-full h-48 object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-[#48A6A7] text-white p-4 text-center">
              <h3 className="font-semibold text-lg">Advanced Diagnostics</h3>
            </div>
            
            {/* Hover state overlay */}
            <div className="absolute inset-0 bg-[#48A6A7]/90 flex items-center justify-center p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <p className="text-white text-center">
              State-of-the-art imaging and testing for accurate diagnosis and personalized treatment.
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="relative rounded-lg overflow-hidden shadow-md group">
            <img 
              src="https://images.pexels.com/photos/5996653/pexels-photo-5996653.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
              alt="Doctor with patient looking at screen" 
              className="w-full h-48 object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-[#48A6A7] text-white p-4 text-center">
              <h3 className="font-semibold text-lg">Expert Specialists</h3>
            </div>
            
            {/* Hover state overlay */}
            <div className="absolute inset-0 bg-[#48A6A7]/90 flex items-center justify-center p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <p className="text-white text-center">
              Our highly trained ophthalmologists offer expert care in all aspects of eye health.
              </p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="relative rounded-lg overflow-hidden shadow-md group">
            <img 
              src="https://images.pexels.com/photos/6749785/pexels-photo-6749785.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
              alt="Modern hospital equipment" 
              className="w-full h-48 object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-[#48A6A7] text-white p-4 text-center">
              <h3 className="font-semibold text-lg">Personalized Treatments</h3>
            </div>
            
            {/* Hover state overlay */}
            <div className="absolute inset-0 bg-[#48A6A7]/90 flex items-center justify-center p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <p className="text-white text-center">
              Tailored treatment plans using the latest techniques to suit every patient’s needs.
              </p>
            </div>
          </div>

          {/* Card 4 - Showing hover state by default */}
          <div className="relative rounded-lg overflow-hidden shadow-md group">
            <img 
              src="https://images.pexels.com/photos/5996670/pexels-photo-5996670.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
              alt="Modern hospital equipment" 
              className="w-full h-48 object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-[#48A6A7] text-white p-4 text-center">
              <h3 className="font-semibold text-lg"> Patient-Focused Care</h3>
            </div>
            
            {/* Hover state overlay */}
            <div className="absolute inset-0 bg-[#48A6A7]/90 flex items-center justify-center p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <p className="text-white text-center">
              From your first visit to follow-up care, your comfort and clarity are our priority.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>


    {/* how it works section */}
    <section className="bg-[#006A71] py-16 px-4 text-white">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Step 1: Become a member */}
          <div className="flex flex-col items-center text-center">
            <div className="mb-6">
              <svg width="80" height="80" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="20" y="20" width="80" height="80" stroke="white" strokeWidth="2" fill="none" />
                <rect x="30" y="30" width="60" height="15" stroke="white" strokeWidth="2" fill="none" />
                <circle cx="40" cy="38" r="5" stroke="white" strokeWidth="2" fill="none" />
                <rect x="30" y="50" width="60" height="10" stroke="white" strokeWidth="2" fill="none" />
                <rect x="30" y="65" width="60" height="10" stroke="white" strokeWidth="2" fill="none" />
                <rect x="30" y="80" width="60" height="10" stroke="white" strokeWidth="2" fill="none" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3">Become a member</h3>
            <p className="text-sm md:text-base text-blue-100">
              After filling in the spaces that require information like First Name, Surname, and Contact Information, you can easily create your membership with your e-mail address and the password you set.
            </p>
          </div>

          {/* Step 2: Find the doctor */}
          <div className="flex flex-col items-center text-center">
            <div className="mb-6">
              <svg width="80" height="80" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="30" y="20" width="40" height="80" rx="5" stroke="white" strokeWidth="2" fill="none" />
                <rect x="35" y="30" width="30" height="45" stroke="white" strokeWidth="2" fill="none" />
                <circle cx="50" cy="90" r="5" stroke="white" strokeWidth="2" fill="none" />
                <circle cx="85" cy="50" r="20" stroke="white" strokeWidth="2" fill="none" />
                <circle cx="85" cy="50" r="5" stroke="white" strokeWidth="2" fill="none" />
                <line x1="85" y1="35" x2="85" y2="40" stroke="white" strokeWidth="2" />
                <line x1="85" y1="60" x2="85" y2="65" stroke="white" strokeWidth="2" />
                <line x1="70" y1="50" x2="75" y2="50" stroke="white" strokeWidth="2" />
                <line x1="95" y1="50" x2="100" y2="50" stroke="white" strokeWidth="2" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3">Find the doctor that you need</h3>
            <p className="text-sm md:text-base text-blue-100">
              You can find the specialist physician you want to have an online interview with or to ask questions by looking them up in the search section by branch, city, doctor or hospital name.
            </p>
          </div>

          {/* Step 3: Talk to Your Doctor */}
          <div className="flex flex-col items-center text-center">
            <div className="mb-6">
              <svg width="80" height="80" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="20" y="20" width="80" height="60" rx="2" stroke="white" strokeWidth="2" fill="none" />
                <line x1="60" y1="80" x2="60" y2="100" stroke="white" strokeWidth="2" />
                <line x1="40" y1="100" x2="80" y2="100" stroke="white" strokeWidth="2" />
                <circle cx="60" cy="50" r="15" stroke="white" strokeWidth="2" fill="none" />
                <circle cx="60" cy="43" r="5" stroke="white" strokeWidth="2" fill="none" />
                <path d="M50 60 C50 55, 70 55, 70 60" stroke="white" strokeWidth="2" fill="none" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3">Talk to Your Doctor</h3>
            <p className="text-sm md:text-base text-blue-100">
              By having an online consultation with your doctor, you can ask any question you want regarding your health in any time.
            </p>
          </div>
        </div>
      </div>
    </section>

    {/* categories section  */}
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <div className="mb-10">
          <h2 className="text-3xl font-bold text-gray-900">Categories</h2>
          <p className="mt-2 text-lg text-gray-600">
          Your eyes deserve focused care. Whether you're managing a condition or seeking routine exams, Lumera offers specialized care across all vision categories.
          </p>
        </div>

        {/* Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {locations.map((loc, idx) => (
            <div
              key={idx}
              className="relative rounded-xl overflow-hidden shadow-md hover:shadow-lg transition"
            >
              <img
                src={loc.image}
                alt={loc.title}
                className="w-full h-60 object-cover"
              />
              <div className="absolute bottom-0 bg-gradient-to-t from-black/60 to-transparent text-white p-4 w-full">
                <h3 className="text-lg font-semibold">{loc.title}</h3>
                <p className="text-sm">{loc.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* call to acton secton */}
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div
          className="lg:py-14 lg:px-20 p-10 rounded-2xl bg-gradient-to-r from-[#006A71] to-[#48A6A7] flex items-center justify-between flex-col lg:flex-row"
        >
          <div className="block text-center mb-5 lg:text-left lg:mb-0">
            <h2
              className="font-manrope text-4xl text-white font-semibold mb-5 lg:mb-2"
            >
              Connect with us
            </h2>
            <p className="text-xl text-white">
              Contact us with any query or any idea.
            </p>
          </div>
          <a
            href="#"
            className="flex items-center gap-2 bg-white rounded-full shadow-sm text-lg text-[#006A71] font-semibold py-4 px-8 transition-all duration-500"
            >Get In Touch
            <svg
              width="19"
              height="14"
              viewBox="0 0 19 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1.75 7L16.4167 7M11.8333 12.5L16.6852 7.64818C16.9907 7.34263 17.1435 7.18985 17.1435 7C17.1435 6.81015 16.9907 6.65737 16.6852 6.35182L11.8333 1.5"
                stroke="#006A71"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </div>
      </div>
    </section>
    </>
  );
}
