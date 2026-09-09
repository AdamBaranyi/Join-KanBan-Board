import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { getData, postData, patchData, deleteData } from "../lib/firebase";
import { type Contact, contactSchema } from "../lib/schemas";
import Modal from "../components/Modal";
import "./Contacts.css";

export default function Contacts() {
  const { t } = useTranslation();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // Form state
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");

  const loadContacts = async () => {
    try {
      const data = await getData<Record<string, unknown>>("contacts");
      if (data) {
        const loaded: Contact[] = Object.entries(data).flatMap(([id, val]) => {
          const parsed = contactSchema.safeParse({ ...(val as object), id });
          return parsed.success ? [parsed.data] : [];
        });
        
        // Sort alphabetically by firstname
        loaded.sort((a, b) => a.firstname.localeCompare(b.firstname));
        setContacts(loaded);
      } else {
        setContacts([]);
      }
    } catch (err) {
      console.error("Failed to load contacts", err);
    }
  };

  useEffect(() => {
    loadContacts();
  }, []);

  const openAddModal = () => {
    setIsEditMode(false);
    setFirstname("");
    setLastname("");
    setEmail("");
    setPhone("");
    setError("");
    setIsModalOpen(true);
  };

  const openEditModal = (contact: Contact) => {
    setIsEditMode(true);
    setFirstname(contact.firstname);
    setLastname(contact.lastname);
    setEmail(contact.email);
    setPhone(contact.phonenumber);
    setError("");
    setIsModalOpen(true);
  };

  const handleSaveContact = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!firstname || !lastname || !email) {
      setError(t("contacts.errorValidation"));
      return;
    }

    try {
      if (isEditMode && selectedContact) {
        // Edit
        await patchData(`contacts/${selectedContact.id}`, {
          firstname,
          lastname,
          email,
          phonenumber: phone,
        });
        const updated = { ...selectedContact, firstname, lastname, email, phonenumber: phone };
        setSelectedContact(updated);
      } else {
        // Add
        const newContact = { firstname, lastname, email, phonenumber: phone };
        const res = await postData("contacts", newContact);
        const added = { ...newContact, id: res.name };
        setSelectedContact(added);
      }
      setIsModalOpen(false);
      loadContacts();
    } catch (err) {
      setError(t("contacts.errorSave"));
      console.error(err);
    }
  };

  const handleDeleteContact = async (contactId: string) => {
    try {
      await deleteData(`contacts/${contactId}`);
      if (selectedContact?.id === contactId) {
        setSelectedContact(null);
      }
      loadContacts();
    } catch (err) {
      console.error("Failed to delete contact", err);
    }
  };

  // Group by first letter
  const groupedContacts = contacts.reduce((acc, contact) => {
    const letter = contact.firstname[0].toUpperCase();
    if (!acc[letter]) acc[letter] = [];
    acc[letter].push(contact);
    return acc;
  }, {} as Record<string, Contact[]>);

  const letters = Object.keys(groupedContacts).sort();

  return (
    <main className="content-container contacts-page">
      <div className={`contacts-list-container ${selectedContact ? 'hide-on-mobile' : ''}`}>
        <button className="add-contact-btn" onClick={openAddModal}>
          {t("contacts.addNewContact")} <img src="/assets/imgs/person_add.svg" alt="Add" />
        </button>
        <div className="contacts-list">
          {letters.map((letter) => (
            <div key={letter} className="contact-group">
              <div className="contact-group-header">{letter}</div>
              <div className="contact-group-divider"></div>
              {groupedContacts[letter].map((contact) => (
                <div
                  key={contact.id}
                  className={`contact-item ${
                    selectedContact?.id === contact.id ? "active" : ""
                  }`}
                  onClick={() => setSelectedContact(contact)}
                >
                  <div className="contact-badge" style={{ backgroundColor: "#ff7a00" }}>
                    {contact.firstname[0]}{contact.lastname[0]}
                  </div>
                  <div className="contact-info">
                    <span className="contact-name">
                      {contact.firstname} {contact.lastname}
                    </span>
                    <span className="contact-email">{contact.email}</span>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className={`contact-details-container ${!selectedContact ? 'hide-on-mobile' : ''}`}>
        <div className="contacts-details-header">
          <h1>{t("contacts.title")}</h1>
          <div className="header-divider hide-on-mobile"></div>
          <span className="subtitle">{t("contacts.subtitle")}</span>
          <button 
            className="back-btn show-on-mobile"
            onClick={() => {
              setSelectedContact(null);
              setShowMobileMenu(false);
            }}
          >
            <img src="/assets/imgs/arrow_left_line_hover.svg" alt="Back" />
          </button>
        </div>

        {selectedContact ? (
          <div className="contact-details-content">
            <div className="contact-details-top">
              <div className="contact-badge large" style={{ backgroundColor: "#ff7a00" }}>
                {selectedContact.firstname[0]}{selectedContact.lastname[0]}
              </div>
              <div className="contact-details-name-actions">
                <h2>{selectedContact.firstname} {selectedContact.lastname}</h2>
                <div className="contact-actions">
                  <button onClick={() => openEditModal(selectedContact)}>
                    <img src="/assets/imgs/edit.svg" alt="Edit" /> {t("contacts.edit")}
                  </button>
                  <button onClick={() => handleDeleteContact(selectedContact.id)}>
                    <img src="/assets/imgs/delete.svg" alt="Delete" /> {t("contacts.delete")}
                  </button>
                </div>
              </div>
            </div>

            <div className="contact-details-info">
              <h3>{t("contacts.contactInfo")}</h3>
              
              <div className="info-row">
                <span className="label">{t("contacts.emailLabel")}</span>
                <a href={`mailto:${selectedContact.email}`} className="value link">
                  {selectedContact.email}
                </a>
              </div>
              
              <div className="info-row">
                <span className="label">{t("contacts.phoneLabel")}</span>
                <span className="value">
                  {selectedContact.phonenumber || t("contacts.notProvided")}
                </span>
              </div>
            </div>
            
            <div className="mobile-edit-wrapper show-on-mobile">
              <div 
                className="mobile-edit-container"
                onClick={() => setShowMobileMenu(!showMobileMenu)}
              >
                <img src="/assets/imgs/Menu Contact options.png" alt="Options" />
              </div>
              
              {showMobileMenu && (
                <div className="mobile-menu">
                  <button onClick={() => { openEditModal(selectedContact); setShowMobileMenu(false); }}>
                    <img src="/assets/imgs/edit.svg" alt="Edit" /> {t("contacts.edit")}
                  </button>
                  <button onClick={() => { handleDeleteContact(selectedContact.id); setShowMobileMenu(false); }}>
                    <img src="/assets/imgs/delete.svg" alt="Delete" /> {t("contacts.delete")}
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="contact-details-placeholder hide-on-mobile">
            {t("contacts.selectPlaceholder")}
          </div>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} className="contact-modal">
        <div className="contact-modal-left">
          <img src="/assets/imgs/logo_white.svg" alt="Join logo" className="modal-logo" />
          <h2>{isEditMode ? t("contacts.editContactTitle") : t("contacts.addContactTitle")}</h2>
          <span className="subtitle">{t("contacts.modalSubtitle")}</span>
          <div className="divider"></div>
        </div>
        <div className="contact-modal-right">
          <div className="contact-badge huge" style={{ backgroundColor: "#d1d1d1" }}>
            <img src="/assets/imgs/person.svg" alt="Person" />
          </div>
          <form className="contact-form" onSubmit={handleSaveContact}>
            <div className="input-with-icon">
              <input
                type="text"
                placeholder={t("contacts.firstNamePlaceholder")}
                value={firstname}
                onChange={(e) => setFirstname(e.target.value)}
                required
              />
              <img src="/assets/imgs/person.svg" alt="User" />
            </div>
            
            <div className="input-with-icon">
              <input
                type="text"
                placeholder={t("contacts.lastNamePlaceholder")}
                value={lastname}
                onChange={(e) => setLastname(e.target.value)}
                required
              />
              <img src="/assets/imgs/person.svg" alt="User" />
            </div>

            <div className="input-with-icon">
              <input
                type="email"
                placeholder={t("contacts.emailLabel")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <img src="/assets/imgs/mail.svg" alt="Mail" />
            </div>

            <div className="input-with-icon">
              <input
                type="tel"
                placeholder={t("contacts.phoneLabel")}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              <img src="/assets/imgs/call.png" alt="Phone" />
            </div>

            {error && <div className="form-error">{error}</div>}

            <div className="form-actions">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setIsModalOpen(false)}
              >
                {t("contacts.cancelBtn")} <img src="/assets/imgs/iconoir_cancel.svg" alt="Cancel" />
              </button>
              <button type="submit" className="btn-primary">
                {isEditMode ? t("contacts.saveBtn") : t("contacts.createBtn")} <img src="/assets/imgs/check.svg" alt="Check" />
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </main>
  );
}
