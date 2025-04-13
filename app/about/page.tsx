export default function AboutPage() {
  return (
    <div
      className="min-h-screen bg-cover bg-center p-6 text-white"
      style={{ backgroundImage: "url('/solar.jpg')" }}
    >
      <div className="max-w-6xl mx-auto space-y-10">
        <div className="mb-6">
          <a href="/" className="inline-block bg-white text-black px-4 py-2 rounded shadow hover:bg-gray-200 transition">← Back to Home</a>
        </div>
        

        <div className="bg-black/70 p-8 rounded-xl shadow-lg">
          <h2 className="text-3xl font-bold mb-4 text-center">Our Mission</h2>
          <p className="text-lg text-center">
            To help individuals efficiently report their insurance claims using a simple and guided tool that offers peace of mind during difficult times.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white/90 text-black p-6 rounded-xl shadow text-center">
            <h3 className="font-semibold text-xl mb-2">Bryan Orozco</h3>
            <h3> Front-End Lead </h3>  
            <p>   Hello, My name is Bryan Orozco and Im a current sophmore at CSUF.
                  Im majoring in computer science and built the website you're currently 
                  Looking at!
            </p>
          </div>
          <div className="bg-white/90 text-black p-6 rounded-xl shadow text-center">
          <h3 className="font-semibold text-xl mb-2">Jacob Fishel</h3>
            <h3> Back-End Lead </h3>  
            <p>   Hello, My name is Bryan Orozco and Im a current sophmore at CSUF.
                  Im majoring in computer science and built the website you're currently 
                  Looking at!
            </p>
          </div>
          <div className="bg-white/90 text-black p-6 rounded-xl shadow text-center">
          <h3 className="font-semibold text-xl mb-2">Duy Le</h3>
            <h3> AI implementation </h3>  
            <p>   Hello, My name is Bryan Orozco and Im a current sophmore at CSUF.
                  Im majoring in computer science and built the website you're currently 
                  Looking at!
            </p>
          </div>
          <div className="bg-white/90 text-black p-6 rounded-xl shadow text-center">
          <h3 className="font-semibold text-xl mb-2">Philip Ma</h3>
            <h3> Back-End Lead </h3>  
            <p>   Hello, My name is Bryan Orozco and Im a current sophmore at CSUF.
                  Im majoring in computer science and built the website you're currently 
                  Looking at!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
