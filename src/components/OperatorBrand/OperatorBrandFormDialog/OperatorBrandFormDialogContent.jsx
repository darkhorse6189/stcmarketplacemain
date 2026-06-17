import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import "./OperatorBrandFormDialogContent.css";

function OperatorBrandFormDialogContent({ formData, setFormData, mode }) {
    return (
        <div className="contact-form-grid">
            <div className="contact-form-row">
                <div className="contact-form-field">
                    <Label>Operator Brands Code</Label>
                    <Input
                        value={formData.operatorsBrandsCode} // Bind to form state
                        onChange={
                        (e) => setFormData({ ...formData, operatorsBrandsCode: e.target.value }) // Update code field
                        }
                        placeholder="Enter Operator Brand Code"
                    />
                </div>
                <div className="contact-form-field">
                    <Label>Description (EN)</Label>
                    <Input
                        value={formData.englishName} // Bind to form state
                        onChange={
                        (e) => setFormData({ ...formData, englishName: e.target.value }) // Update English name field
                        }
                        placeholder="Enter English Name"
                    />
                </div>
                <div className="contact-form-field">
                    <Label>Description (AR)</Label>
                    <Input
                        value={formData.arabicName} // Bind to form state
                        onChange={
                        (e) => setFormData({ ...formData, arabicName: e.target.value }) // Update Arabic name field
                        }
                        placeholder="Enter Arabic Name"
                    />
                </div>
            </div>

            <div className="contact-form-row">
                {/* Created By / Modified By */}
                <div className="contact-form-field">
                <Label>{mode === "edit" ? "Modified By" : "Created By"}</Label>
                <Input
                    value={mode === "edit" ? formData.modifiedBy : formData.createdBy}
                    onChange={(e) =>
                    setFormData({
                            ...formData,
                            ...(mode === "edit"
                            ? { modifiedBy: e.target.value }
                            : { createdBy: e.target.value }),
                        })
                    }
                    placeholder={
                        mode === "edit" ? "Enter Modified By" : "Enter Created By"
                    }
                />
                </div>
            </div>
        </div>
    );
}

export default OperatorBrandFormDialogContent;
