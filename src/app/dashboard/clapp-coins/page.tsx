"use client";

import { useState } from "react";

// Define User and Transaction types
interface User {
  id: number;
  name: string;
  coins: number;
}

interface Transaction {
  id: number;
  user: string;
  activity: string;
  type: "Earned" | "Spent";
  amount: number;
  date: string;
}

export default function ClappCoinsAdminPage() {
  const [users, setUsers] = useState<User[]>([
    { id: 1, name: "John Doe", coins: 500 },
    { id: 2, name: "Jane Doe", coins: 300 },
    { id: 3, name: "Alex Smith", coins: 700 },
  ]);

  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: 1, user: "John Doe", activity: "Sign-up Bonus", type: "Earned", amount: 100, date: "2024-06-01" },
    { id: 2, user: "Jane Doe", activity: "Premium Feature Purchase", type: "Earned", amount: 300, date: "2024-06-02" },
    { id: 3, user: "John Doe", activity: "Unlock Disease Info", type: "Spent", amount: 500, date: "2024-06-03" },
  ]);

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [adjustCoins, setAdjustCoins] = useState<number>(0);

  const handleSelectUser = (user: User) => {
    setSelectedUser(user);
    setAdjustCoins(0);
  };

  const handleAddCoins = () => {
    if (selectedUser && adjustCoins > 0) {
      setUsers((prev) =>
        prev.map((user) =>
          user.id === selectedUser.id ? { ...user, coins: user.coins + adjustCoins } : user
        )
      );
      setTransactions((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          user: selectedUser.name,
          activity: "Admin Add Coins",
          type: "Earned",
          amount: adjustCoins,
          date: new Date().toISOString().split("T")[0],
        },
      ]);
    }
  };

  const handleDeductCoins = () => {
    if (selectedUser && adjustCoins > 0 && selectedUser.coins >= adjustCoins) {
      setUsers((prev) =>
        prev.map((user) =>
          user.id === selectedUser.id ? { ...user, coins: user.coins - adjustCoins } : user
        )
      );
      setTransactions((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          user: selectedUser.name,
          activity: "Admin Deduct Coins",
          type: "Spent",
          amount: adjustCoins,
          date: new Date().toISOString().split("T")[0],
        },
      ]);
    }
  };

  return (
    <div className="p-8 bg-gray-100 h-screen flex">
      {/* User List */}
      <div className="w-1/4 bg-white shadow-lg rounded-lg p-4 mr-4">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Users</h2>
        <ul className="divide-y divide-gray-300">
          {users.map((user) => (
            <li
              key={user.id}
              onClick={() => handleSelectUser(user)}
              className={`p-3 cursor-pointer rounded-lg hover:bg-green-100 transition ${
                selectedUser?.id === user.id ? "bg-green-200" : ""
              }`}
            >
              <p className="font-semibold text-gray-800">{user.name}</p>
              <p className="text-sm text-gray-600">{user.coins} Coins</p>
            </li>
          ))}
        </ul>
      </div>

      {/* Admin Actions */}
      <div className="flex-1 bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">Admin Actions</h2>
        {selectedUser ? (
          <div>
            <h3 className="text-xl font-medium text-gray-700 mb-4">
              Adjust Coins for: <span className="text-green-600">{selectedUser.name}</span>
            </h3>
            <input
              type="number"
              value={adjustCoins}
              onChange={(e) => setAdjustCoins(Number(e.target.value) || 0)}
              placeholder="Enter coin amount"
              className="w-full p-2 border border-gray-300 rounded-sm mb-4"
            />
            <div className="flex justify-center space-x-4">
              <button
                onClick={handleAddCoins}
                className="bg-green-600 text-white px-4 py-2 rounded-sm hover:bg-green-700"
              >
                Add Coins
              </button>
              <button
                onClick={handleDeductCoins}
                className="bg-red-600 text-white px-4 py-2 rounded-sm hover:bg-red-700"
              >
                Deduct Coins
              </button>
            </div>
          </div>
        ) : (
          <p className="text-gray-500 text-center">Select a user to adjust coins.</p>
        )}
      </div>

      {/* Transaction History */}
      <div className="w-1/3 bg-white shadow-lg rounded-lg p-6 ml-4">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Transaction Log</h2>
        <ul className="divide-y divide-gray-300 overflow-y-auto max-h-96">
          {transactions.map((txn) => (
            <li key={txn.id} className="py-2">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold text-gray-800">{txn.user}</p>
                  <p className="text-sm text-gray-500">{txn.activity}</p>
                </div>
                <span
                  className={`text-lg font-bold ${
                    txn.type === "Spent" ? "text-red-600" : "text-green-600"
                  }`}
                >
                  {txn.type === "Spent" ? "-" : "+"} {txn.amount} Coins
                </span>
                <span className="text-gray-500 text-sm">{txn.date}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
