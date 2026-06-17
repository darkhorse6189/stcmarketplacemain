import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import "./CategoryFormDialogContent.css";

function CategoryFormDialogContent({ formData, setFormData, mode }) {
    return (
        <div className="contact-form-grid">
            {/* Category Info */}
            <div className="contact-form-row">
                <div className="contact-form-field">
                    <Label>Category Code</Label>
                    <Input
                        value={formData.categoryCode}
                        onChange={(e) => setFormData({ ...formData, categoryCode: e.target.value })}
                        placeholder="Enter Category Code"
                    />
                </div>
                <div className="contact-form-field">
                    <Label>Description (EN)</Label>
                    <Input
                        value={formData.englishName}
                        onChange={(e) =>
                        setFormData({ ...formData, englishName: e.target.value })
                        }
                        placeholder="Enter English Name"
                    />
                </div>
                <div className="contact-form-field">
                    <Label>Description (AR)</Label>
                    <Input
                        value={formData.arabicName}
                        onChange={(e) =>
                        setFormData({ ...formData, arabicName: e.target.value })
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
                        mode === "edit" ? "Enter modified by" : "Enter created by"
                    }
                />
                </div>
            </div>
        </div>
    );
}

export default CategoryFormDialogContent;