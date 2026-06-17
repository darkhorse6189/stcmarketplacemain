import { useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import "./ImageModalDialog.css";

function ImageModalDialog( { selectedImage, handleCloseModal} ) {
    const isOpen = !!selectedImage;

    useEffect(() => {
        const appRoot = document.getElementById("root"); // or your wrapper id/class
        if (isOpen) {
        appRoot.classList.add("app-blurred");
        } else {
        appRoot.classList.remove("app-blurred");
        }

        return () => appRoot.classList.remove("app-blurred");
    }, [isOpen]);

    return (
        <Dialog.Root
            open={isOpen}
            onOpenChange={(open) => !open && handleCloseModal()}
        >
            <Dialog.Portal>
                <Dialog.Overlay className="image-modal-overlay" />
                <Dialog.Content className="image-modal-content">
                    <Dialog.Title className="sr-only">Image preview</Dialog.Title>
                        {selectedImage && (
                            <img
                                src={selectedImage}
                                alt="Product"
                                className="image-modal-img"
                            />
                        )}
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}

export default ImageModalDialog;