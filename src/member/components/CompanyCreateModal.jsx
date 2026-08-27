function CompanyCreateModal(props) {
  const { onClose } = props;

  return (
    <div>
      <h2>Create Company</h2>
      <button onClick={onClose}>Close</button>
    </div>
  );
}

export default CompanyCreateModal;