const styles = {
  Active: "bg-green-500/10 text-green-600",
  Draft: "bg-yellow-500/10 text-yellow-600",
  Expired: "bg-red-500/10 text-red-600",
}

const ContractStatusBadge = ({ status }) => {
  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-medium ${styles[status]}`}>
      {status}
    </span>
  )
}

export default ContractStatusBadge
