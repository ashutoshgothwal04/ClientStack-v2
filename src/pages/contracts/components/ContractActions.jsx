const ContractActions = ({ onView }) => {
  return (
    <button
      onClick={onView}
      className="text-sm font-medium text-primary hover:underline"
    >
      View
    </button>
  )
}

export default ContractActions
