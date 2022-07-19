import { useState } from "react";
import { Dialog, Transition } from "@headlessui/react";

function Modal({ user, message }) {
   let [isOpen, setIsOpen] = useState(true);

   return (
      <Transition
         show={isOpen}
         enter="transition duration-1000 ease-out"
         enterFrom="transform scale-95 opacity-0"
         enterTo="transform scale-1000 opacity-100"
         leave="transition duration-75 ease-out"
         leaveFrom="transform scale-100 opacity-100"
         leaveTo="transform scale-95 opacity-0"
      >
         <Dialog
            className="Dialog"
            open={isOpen}
            onClose={() => setIsOpen(false)}
         >
            <div className="Dialog-panel" aria-hidden="true">
               <Dialog.Panel className="Dialog-down">
                  {/* <Dialog.Title>Deactivate account</Dialog.Title> */}
                  <Dialog.Description className="Dialog-descr">
                     <img
                        className="Dialog-panel__img"
                        src={message.image}
                        alt="message"
                     />
                     {/* <Image width={100%} height="100vh" layout="fixed" src={message.image}
                     alt="message" /> */}
                     {/* <button className="btn" onClick={() => setIsOpen(false)}>
                     <CloseIcon />
                  </button> */}
                  </Dialog.Description>
               </Dialog.Panel>
            </div>
         </Dialog>
      </Transition>
   );
}
export default Modal;
