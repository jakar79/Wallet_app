"use client";
import { useEffect, useState } from "react";
import api from "./api";
import toast from "react-hot-toast";
import { Activity, ArrowDownCircle, ArrowUpCircle, Edit, PlusCircle, Trash, TrendingDown, TrendingUp, Wallet } from "lucide-react";


//-- Transaction interface --
type Transaction = {
  id: string;
  text: string;
  amount: number;
  created_at: string;
}

//-- Home component --
export default function Home() {
  //-- create state for transactions--
  const [transactions, setTransactions] = useState<Transaction[]>([]); 

  //-- create state for text, amount and loading--
  const [text, setText] = useState<string>(""); //-- create state for text--
  const [amount, setAmount] = useState<number | "" >(0); //-- create state for amount--
  const [loading, setLoading] = useState<boolean>(false);

  //-- Get Transactions function from api and set to transactions state from api response data --
  const getTransactions = async () => {
    try{
      const res = await api.get<Transaction[]>("transactions/"); //-- call /api/transactions/ URL from api.ts--
      setTransactions(res.data); //-- set transactions to response data from api--
      toast.success("Transactions fetched successfully");
    } catch (error) {
      console.error(error);
      toast.error("Error fetching transactions");
    }
  };

  //-- Delete Transactions with id --
    const deleteTransactions = async (id : string) => {
    try{
      await api.delete(`transactions/${id}/`); //-- delete /api/transactions/${id}/ URL from api.ts --
      getTransactions();
      toast('Transactions successfully deleted',{icon: '🗑️'});
    } catch (error) {
      console.error("Error deleting transaction", error);
      toast.error("Error deleting transaction");
    }
  };

  //-- Add Transactions --
    const addTransactions = async () => {
      if(!text || amount == "" || isNaN(Number(amount))) {
        toast.error("Description and amount are required");
        return
      }
      //-- set loading to true --
      setLoading(true);
      try{
        await api.post("transactions/", {text, amount: Number(amount)}); //-- Send transactionsto api --
        getTransactions();
        setText("");
        setAmount(0);
        //-- close modal --
        const modal = document.getElementById('my_modal_3') as HTMLDialogElement;
        if(modal) {
          modal.close();
        }

        toast.success("Transaction added successfully");

      } catch (error) {
        console.error("Error adding transaction",error);
        toast.error("Error adding transaction");
      } finally {
        //-- set loading to false --
        setLoading(false);
      }
    };


  // -- Load Transactions function on Page load
  useEffect(() => {
    getTransactions(); 
  }, []);

  //-- Calculate balance, income, expense, total and ratio --
  const amounts = transactions.map((t) => Number(t.amount) || 0); //-- create array of amounts from transactions--
  const balance = amounts.reduce((acc, item) => (acc += item), 0) || 0; //-- calculate balance by adding all amounts in amounts array-- acc = accumulator, item = current item in amounts array-- (Solde)
  const income = amounts.filter((i) => i > 0).reduce((acc, i) => (acc += i), 0) || 0; //-- calculate income by adding all positive amounts in amounts array-- (Revenues)
  const expense = (amounts.filter((i) => i < 0).reduce((acc, i) => (acc += i), 0) * 1 || 0);//- calculate expense by adding all negative amounts in amounts array-- i is current item in amounts array-- (Dépenses)
 
  const ratio = income > 0 ? Math.min((Math.abs(expense) / income) * 100, 100) : 0; //-- calculate ratio by dividing expense by income-- if income is 0, ratio is 0 --

  //-- Format date function to fr-FR --
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }
  
  //-- Render html page --
  return (
    <div className="w-2/3 flex flex-col grap-4"> {/*-- create container for stats--*/}
      <div className="flex justify-between border-2 border-warning/10 border-dotted rounded-2xl bg-warning/5 p-5"> {/*-- create container for stats--*/}

        <div className="flex flex-col gap-1">          {/*-- create container for balance--*/}
            <div className="badge badge-soft">
              <Wallet className="w-4 h4"/>
              Solde
            </div>
          <div className="stat-value">
            {balance.toFixed(2)} Dh
          </div> 
        </div>

        <div className="flex flex-col gap-1">          {/*-- create container for revenus--*/}
          <div className="badge badge-soft badge-success">
            <ArrowUpCircle className="w-4 h4"/>
              Revenus
          </div>
          <div className="stat-value">
            {income.toFixed(2)} Dh
          </div> 
        </div>

        <div className="flex flex-col gap-1">          {/*-- create container for depenses--*/}
          <div className="badge badge-soft badge-error">
            <ArrowDownCircle className="w-4 h4"/>
              Dépenses
          </div>
          <div className="stat-value">
            {expense.toFixed(2)} Dh
          </div> 
        </div>

      </div>

      <div className="border-2 border-warning/10 border-dotted rounded-2xl bg-warning/5 p-5"> {/*-- create container for ratio--*/}
        <div className="flex justify-between items-center mb-1"> 
          
            <div className="badge badge-soft badge-warning gap-1"> {/*-- create container for ratio--*/}
              <Activity className="w-4 h4"/>
              Taux (Dépenses vs Revenus)
            </div>
            <div>
              {ratio.toFixed(0)}%
            </div>
          

        </div> 
        <progress 
          className="progress progress-warning" 
          value={ratio} 
          max="100" /> {/*-- create progress bar--*/}

      </div>

      { /*button */}
        {/* You can open the modal using document.getElementById('ID').showModal() method */}
        <button className="btn btn-warning" onClick={()=>(document.getElementById('my_modal_3') as HTMLDialogElement).showModal()}>
          <PlusCircle className="w-4 h4"/>
          Ajouter une transaction
        </button>

      <div className="overflow-x-auto border-2 border-warning/10 border-dotted rounded-2xl bg-warning/5">
        <table className="table">
          {/* head */}
          <thead>
            <tr>
              <th>#</th>
              <th>Description</th>
              <th>Montant</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>

            {/*-- map transactions to table rows--*/}
            {transactions.map((t, index) => ( 
              <tr key={t.id}>
                <th>{index + 1}</th>
                <td>{t.text}</td>
                <td className="font-semibold flex items-center gap-2"> {/*-- create container for amount with icon --*/}
                  
                  { /*-- if amount is positive, show trending up icon, else show trending down icon-*/}
                  {t.amount > 0 ? (<TrendingUp className="text-success w-6 h-6"/>) : (<TrendingDown className="text-error w-6 h-6"/>)} 

                  { /*-- if amount is positive, show plus sign, else show minus sign--*/}
                  {t.amount > 0 ? `+${t.amount}` : `${t.amount}`}
                </td>

                { /*-- format date--*/}
                <td>{formatDate(t.created_at)}</td>
                <td>
                  <button onClick={() => deleteTransactions(t.id)} className="btn btn-ghost btn-soft btn-xs" title="Supprimer"><Trash className="w-4 h-4"/></button>
                </td>
              </tr>
            ))}



          </tbody>
        </table>

      </div>
        <dialog id="my_modal_3" className="modal backdrop-blur-xs">
          <div className="modal-box border-2 border-warning/10 border-dotted">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
            </form>
            <h3 className="font-bold text-lg">Ajouter une transaction</h3>
            <div className="flex flex-col gap-4 mt-4">
              <div className="flex flex-col gap-2">

                <label htmlFor="description">Description</label>
                <input className="input input-bordered"
                type="text" 
                name="text" 
                placeholder="Entrez une description"
                onChange={(e) => setText(e.target.value)}
                value={text}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="amount">Montant (Dh)</label>
                <input className="input input-bordered"
                type="number" 
                name="amount" 
                placeholder=""
                onChange={(e) => setAmount(e.target.value === "" ? 0 : parseFloat(e.target.value))}
                value={amount}
                />
              </div>


              <div className="modal-action">
                <button className="btn btn-warning" onClick={addTransactions} disabled={!text || !amount || loading}>
                  <PlusCircle className="w-4 h4"/>
                  Ajouter
                </button>
              </div>

            </div>
          </div>
        </dialog>
    </div>
  );
}
