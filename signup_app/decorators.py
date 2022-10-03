



from django.shortcuts import render, redirect
def allowed_user(allowed_roles = []):
    def decorator(view_func):
        def wrapper_func(request,*args,**kwargs):
            group = None
            group_len = None
            if request.user.groups.exists():
                print(request.user.groups.all())
                group_len = len(request.user.groups.all())
            print('group=',group,'allow=',allowed_roles)
            if group_len != None:
                i=0
                while i<group_len:
                    group = request.user.groups.all()[i].name
                    if group in allowed_roles:
                        return view_func(request,*args,**kwargs)
                    i+=1
                return redirect('Dashboard')  
            else:
                return redirect('Dashboard')  
                
        return wrapper_func
    return decorator