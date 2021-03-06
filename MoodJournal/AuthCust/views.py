from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from allauth.account.utils import send_email_confirmation


@api_view(['GET'])
@permission_classes((IsAuthenticated, ))
def resend_verification_email(request):
    send_email_confirmation(request, request.user)
    return Response({'emailed': 'OK'})

@api_view()
def null_view(request):
    return Response(status=status.HTTP_400_BAD_REQUEST)