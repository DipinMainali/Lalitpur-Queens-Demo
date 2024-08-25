// components/MatchCard.js
export default function MatchCard({ date, opponent, location, time }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="text-lg font-semibold mb-2">{date}</div>
      <div className="text-xl mb-2">Lalitpur Queens vs {opponent}</div>
      <div className="text-gray-600">{location}</div>
      <div className="text-gray-600">{time}</div>
    </div>
  );
}
