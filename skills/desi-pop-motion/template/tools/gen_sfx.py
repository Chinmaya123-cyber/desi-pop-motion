"""Procedural SFX kit for the birthday invite (numpy, royalty-free)."""
import pathlib, numpy as np
from scipy.io import wavfile
from scipy.signal import butter, sosfilt
SR=44100; OUT=pathlib.Path(__file__).resolve().parent.parent/"public"/"sfx"; OUT.mkdir(parents=True,exist_ok=True)
rng=np.random.default_rng(3)
t_=lambda d: np.arange(int(d*SR))/SR
env=lambda n,k: np.exp(-np.arange(n)/SR*k)
def filt(x,f,kind,o=2): return sosfilt(butter(o,f,kind,fs=SR,output="sos"),x)
def save(name,x,peak=0.9):
    x=x/np.abs(x).max()*peak; f=int(.005*SR); x[-f:]*=np.linspace(1,0,f)
    wavfile.write(OUT/name,SR,(np.stack([x,x],1)*32767).astype(np.int16))
def place(buf,x,at,g=1.0):
    i=int(at*SR); j=min(len(buf),i+len(x)); buf[i:j]+=x[:j-i]*g
def whoosh(d=.45,up=True):
    n=int(d*SR); x=rng.standard_normal(n); out=np.zeros(n); b=512
    for i in range(0,n,b):
        p=i/n; f=(500*(8000/500)**p) if up else (6000*(400/6000)**p)
        seg=x[max(0,i-2048):i+b]; y=filt(seg,[f*.6,min(SR/2-200,f*1.6)],"band")
        out[i:i+b]=y[-len(out[i:i+b]):]
    return out*np.sin(np.linspace(0,np.pi,n))**1.5
def pop(f0=900,f1=260,d=.09):
    t=t_(d); f=f1+(f0-f1)*np.exp(-t*55); return np.sin(2*np.pi*np.cumsum(f)/SR)*env(len(t),38)
def stamp():
    t=t_(.35); th=np.sin(2*np.pi*(60+90*np.exp(-t*40))*t)*env(len(t),12)
    sl=filt(rng.standard_normal(len(t)),[300,2500],"band")*env(len(t),45); return np.tanh((th+sl*.7)*1.5)
def impact(d=1.6):
    t=t_(d); sub=np.sin(2*np.pi*np.cumsum(38+80*np.exp(-t*9))/SR)*env(len(t),2.6)
    no=filt(rng.standard_normal(len(t)),3500,"low")*env(len(t),6)*.5; return np.tanh((sub+no)*1.8)
def saw(f):  # f array
    ph=np.cumsum(f)/SR; return 2*(ph-np.floor(ph+.5))
def horn_blast(d):
    t=t_(d); base=np.where(t<.04,1.0+ (0.04-t)*3,1.0)
    vib=1+0.006*np.sin(2*np.pi*6*t)
    x=sum(saw(np.full(len(t),f)*base*vib*(1+0.003*k)) for k,f in enumerate([466,470,587,700]))
    x=filt(x,[300,3800],"band")*np.minimum(1,t/.01)*np.minimum(1,(d-t)/.03)
    return np.tanh(x*2.5)
def airhorn():
    out=np.zeros(int(1.6*SR))
    for at,d in [(0,.16),(.2,.16),(.4,.9)]: place(out,horn_blast(d),at)
    return out
def scratch():
    # vinyl scratch: a buzzy vowel-ish tone played with back-and-forth speed
    d=.5; t=t_(d); sp=np.sin(2*np.pi*np.array([0]*len(t))+0)+0
    speed=np.abs(np.sin(2*np.pi*4*t))*1.6+.1
    f=180*speed; src=saw(f)+.4*saw(f*2.01)
    src=filt(src,[400,3000],"band")+filt(rng.standard_normal(len(t)),[1500,6000],"band")*.25*speed
    return src*np.minimum(1,t/.01)*np.minimum(1,(d-t)/.05)
def glitch():
    n=int(.25*SR); x=np.zeros(n)
    for i in range(0,n,441):
        seg=t_(.01)[:len(x[i:i+441])]; x[i:i+441]=np.sign(np.sin(2*np.pi*(200+rng.random()*2000)*seg))*rng.random()
    return filt(x,5000,"low")*.4
def static(d=.9):
    n=int(d*SR); x=filt(rng.standard_normal(n),[800,9000],"band"); return x*np.minimum(1,(n-np.arange(n))/(.2*SR))
def ding():
    t=t_(1.0); return sum(np.sin(2*np.pi*f*t)*env(len(t),k)*a for f,k,a in [(1568,4,1),(3136,7,.4),(2349,5,.3)])
def cash():
    out=np.zeros(int(.8*SR)); place(out,ding()[:int(.7*SR)],.08); place(out,stamp()*.6,0); return out
def boing():
    t=t_(.5); f=220+180*np.sin(2*np.pi*9*t)*np.exp(-t*5); return np.sin(2*np.pi*np.cumsum(f)/SR)*env(len(t),5)
if __name__=="__main__":
    save("whoosh.wav",whoosh()); save("whoosh_down.wav",whoosh(.4,False)); save("whoosh_short.wav",whoosh(.22))
    save("pop.wav",pop()); save("pop_hi.wav",pop(1500,500,.07)); save("stamp.wav",stamp()); save("impact.wav",impact())
    save("airhorn.wav",airhorn()); save("scratch.wav",scratch()); save("glitch.wav",glitch()); save("static.wav",static())
    save("ding.wav",ding()); save("cash.wav",cash()); save("boing.wav",boing())
    print("ok")
