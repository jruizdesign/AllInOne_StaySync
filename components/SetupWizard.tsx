import React, { useState } from 'react';
import { User, Role, Room, RoomStatus } from '../types';
import { systemService } from '../services/systemService';
import { UserPlus, Shield, ArrowRight, Building2, Grid, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface SetupWizardProps {
  onComplete: () => void;
}

const StepForm = ({ title, desc, icon: Icon, children, onSubmit, buttonText }: any) => (
  <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100 max-w-md w-full animate-fade-in">
      <div className="flex flex-col items-center text-center mb-8">
          <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mb-4">
              <Icon className="w-8 h-8 text-indigo-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
          <p className="text-slate-500 mt-2">{desc}</p>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }} className="space-y-4">
          {children}
          <button type="submit" className="w-full py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 mt-4">
              {buttonText} <ArrowRight className="w-4 h-4" />
          </button>
      </form>
  </div>
);

const UserInputs = ({ data, setData }: any) => (
    <>
        <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
            <input required type="text" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all" value={data.name} onChange={e => setData({...data, name: e.target.value})} />
        </div>
        <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
            <input required type="email" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all" value={data.email} onChange={e => setData({...data, email: e.target.value})} />
        </div>
        <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Set Password</label>
            <input required type="password" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all" value={data.password} onChange={e => setData({...data, password: e.target.value})} />
        </div>
    </>
);

export const SetupWizard: React.FC<SetupWizardProps> = ({ onComplete }) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const { signIn } = useAuth();
  
  // User Forms
  const [owner, setOwner] = useState({ name: '', email: '', password: '' });
  const [manager, setManager] = useState({ name: '', email: '', password: '' });
  const [superuser, setSuperuser] = useState({ name: '', email: '', password: '' });

  // Room Config
  const [roomConfig, setRoomConfig] = useState({
      floors: 3,
      roomsPerFloor: 10,
      basePrice: 150,
      roomType: 'Standard'
  });

  const handleSaveUserStep = (role: Role, data: typeof owner) => {
    const newUser: User = {
        uid: `${role.toLowerCase()}_${Date.now()}`,
        email: data.email,
        displayName: data.name,
        photoURL: null,
        role: role
    };
    systemService.saveRealUser(newUser, data.password);
    setStep((step + 1) as any);
  };

  const generateRooms = () => {
    const rooms: Room[] = [];
    for (let f = 1; f <= roomConfig.floors; f++) {
        for (let r = 1; r <= roomConfig.roomsPerFloor; r++) {
            const roomNum = `${f}${r.toString().padStart(2, '0')}`; // e.g., 101, 102
            rooms.push({
                id: `room_${roomNum}`,
                number: roomNum,
                floor: f,
                type: roomConfig.roomType,
                price: roomConfig.basePrice + ((f - 1) * 20), // Higher floors cost slightly more
                capacity: 2,
                status: RoomStatus.AVAILABLE,
                features: ['Standard Amenities']
            });
        }
    }
    systemService.saveRealRooms(rooms);
    handleFinalize();
  };

  const handleFinalize = async () => {
      systemService.completeSetup();
      // Auto login as superuser
      try {
          await signIn(superuser.email, superuser.password);
          onComplete();
      } catch (e) {
          alert("Setup complete, please login.");
          onComplete();
      }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Welcome to StaySync</h1>
            <p className="text-slate-500">Initial System Configuration</p>
        </div>

        {step === 1 && (
            <div className="flex justify-center w-full">
                <StepForm 
                    title="Owner Account"
                    desc="Create the primary business owner account."
                    icon={Building2}
                    onSubmit={() => handleSaveUserStep('OWNER', owner)}
                    buttonText="Create Owner & Continue"
                >
                    <UserInputs data={owner} setData={setOwner} />
                </StepForm>
            </div>
        )}

        {step === 2 && (
             <div className="flex justify-center w-full">
                <StepForm 
                    title="Manager Account"
                    desc="Create the operational manager account."
                    icon={UserPlus}
                    onSubmit={() => handleSaveUserStep('MANAGER', manager)}
                    buttonText="Create Manager & Continue"
                >
                    <UserInputs data={manager} setData={setManager} />
                </StepForm>
            </div>
        )}

        {step === 3 && (
             <div className="flex justify-center w-full">
                <StepForm 
                    title="Reconfigure Superuser"
                    desc="Reset the master administrator credentials."
                    icon={Shield}
                    onSubmit={() => handleSaveUserStep('SUPERUSER', superuser)}
                    buttonText="Continue to Room Setup"
                >
                    <UserInputs data={superuser} setData={setSuperuser} />
                </StepForm>
            </div>
        )}

        {step === 4 && (
             <div className="flex justify-center w-full">
                <StepForm 
                    title="Room Configuration"
                    desc="Bulk generate your initial room layout."
                    icon={Grid}
                    onSubmit={generateRooms}
                    buttonText="Generate Rooms & Finish"
                >
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Total Floors</label>
                            <input required type="number" min="1" max="50" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" value={roomConfig.floors} onChange={e => setRoomConfig({...roomConfig, floors: parseInt(e.target.value)})} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Rooms per Floor</label>
                            <input required type="number" min="1" max="100" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" value={roomConfig.roomsPerFloor} onChange={e => setRoomConfig({...roomConfig, roomsPerFloor: parseInt(e.target.value)})} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Base Price ($)</label>
                            <input required type="number" min="0" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" value={roomConfig.basePrice} onChange={e => setRoomConfig({...roomConfig, basePrice: parseInt(e.target.value)})} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Def. Type</label>
                            <select className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white" value={roomConfig.roomType} onChange={e => setRoomConfig({...roomConfig, roomType: e.target.value})}>
                                <option value="Standard">Standard</option>
                                <option value="Deluxe">Deluxe</option>
                                <option value="Suite">Suite</option>
                            </select>
                        </div>
                    </div>
                    <div className="bg-indigo-50 text-indigo-700 p-3 rounded-lg text-xs mt-2 flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        This will generate {roomConfig.floors * roomConfig.roomsPerFloor} rooms (e.g., 101, 102...). You can add/remove specific rooms later.
                    </div>
                </StepForm>
            </div>
        )}
        
        <div className="mt-8 flex justify-center gap-2">
            {[1, 2, 3, 4].map(i => (
                <div key={i} className={`h-1.5 w-8 rounded-full transition-colors ${i === step ? 'bg-indigo-600' : 'bg-slate-200'}`} />
            ))}
        </div>
    </div>
  );
};