export default function FeatureCard({ icon, title, description }) {
  return (
    <div className="glow-on-hover bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 hover:scale-105 hover:-translate-y-2 cursor-pointer group">
      <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-primary to-secondary rounded-lg mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
        <span className="text-2xl">{icon}</span>
      </div>
      <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white group-hover:text-primary transition-colors duration-300">
        {title}
      </h3>
      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
        {description}
      </p>
    </div>
  )
}
