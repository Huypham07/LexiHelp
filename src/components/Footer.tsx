import { Save, RotateCcw } from "lucide-react";
import { CardFooter } from "./ui/card";
import { Button } from "./ui/button";


const Footer: React.FC = () => {
  return (
    <CardFooter className="card-footer flex justify-between px-6 pb-3 pt-3">
      <Button variant="outline">
        <RotateCcw className="mr-1" />
        Reset
      </Button>
      <Button>
        <Save className="mr-1"/>
        Apply Settings
      </Button>
    </CardFooter>
  );
};

export default Footer;
