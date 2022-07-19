import { useState } from "react";
import { Dialog } from "@headlessui/react";


function MyImage() {
   let [isOpen, setIsOpen] = useState(true);

   return (
      <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
         <Dialog.Panel>
            <Dialog.Title>Deactivate account</Dialog.Title>
            <Dialog.Description>
               This will permanently deactivate your account
            </Dialog.Description>

            

            <button onClick={() => setIsOpen(false)}>x</button>

         </Dialog.Panel>
      </Dialog>
   );
}
export default MyImage;