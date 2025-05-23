import { Button } from "./ui/button";
import { ArrowLeft } from "lucide-react"; // or any icon library you use

export default function ActionBar({ onBack, onCreate }) {
  return (
    <div className="flex justify-between items-center w-full px-6 py-2 bg-gradient-to-r from-blue-100 to-white border-b">
      <Button
        variant="ghost"
        className="flex items-center gap-2 text-gray-700"
        onClick={onBack}
      >
        <ArrowLeft className="w-4 h-4" />
        Voltar
      </Button>
      <Button
        className="bg-orange-500 hover:bg-orange-400 text-black font-normal rounded-xl px-8"
        onClick={onCreate}
        type="button"
      >
        Criar Rota
      </Button>
    </div>
  );
}
