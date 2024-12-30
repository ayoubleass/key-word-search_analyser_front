import image1 from '../assets/images/image1.jpg';



export default function Aboutus( ) {
    return  (<section className="bg-gradient-to-b to-white py-5">
    <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
        {/* Left Section - Text */}
        <div className="md:w-1/2 text-center md:text-left">
            <h2 className="text-3xl sm:text-2xl font-semibold text-gray-800 mb-6">
            Powerful SEO Keyword Analyzer
            </h2>
            <p className="text-gray-600 leading-relaxed mb-8">
            Our advanced SEO keyword analyzer helps you uncover high-performing keywords
            that boost your website's organic traffic. Leverage real-time data and insights 
            on search volume, competition levels, and trending topics to enhance your content
            strategy. Make informed, data-driven decisions for maximum online visibility.
            </p>
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition duration-300">
            Try Analyzer Now
            </button>
        </div>

        {/* Right Section - Image */}
        <div className="md:w-1/2">
            <img
                src={image1}
                alt="SEO Keyword Analysis Dashboard"
                className="w-full rounded-xl shadow-2xl object-cover"
            />
        </div>
        </div>
  </div>
</section>)

}