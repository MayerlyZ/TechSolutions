import CustomersTable from  '@/app/components/customers/CustomersTable'; 

export default function CustomersPage() {
  return (
    <section>
      <h1 className="text-3xl font-bold mb-4">Gestión de Clientes</h1>


      <CustomersTable /> 
    </section>
  );
}